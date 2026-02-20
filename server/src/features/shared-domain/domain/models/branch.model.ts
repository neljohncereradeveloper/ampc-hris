import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { BranchBusinessException } from '../exceptions/branch-business.exception';
import { toLowerCaseString, toNumber } from '@/core/utils/coercion.util';

/**
 * Branch domain entity.
 *
 * Encapsulates all business rules and state transitions for a branch.
 * Use the static `create()` factory method to instantiate a validated branch.
 */
export class Branch {
  /** Auto-incremented primary key. Null when not yet persisted. */
  id?: number | null;

  /** Branch description / name. */
  desc1: string;

  /** Unique branch code identifier. */
  br_code: string;

  /** Who created this branch. Required at creation time. */
  created_by: string;

  /** Timestamp when this branch was created. Always set on construction. */
  created_at: Date;

  /** Who last updated this branch. Null until first update. */
  updated_by: string | null;

  /** Timestamp of the last update. Null until first update. */
  updated_at: Date | null;

  /** Who archived (soft-deleted) this branch. Null if not archived. */
  deleted_by: string | null;

  /** Timestamp when this branch was archived. Null if not archived. */
  deleted_at: Date | null;

  /**
   * Normalizes and initializes branch fields from a raw DTO.
   *
   * Responsibilities:
   * - Coerces all string fields to lowercase via `toLowerCaseString`
   * - Sets audit timestamps (`created_at`)
   * - Defaults optional fields (`updated_by`, `updated_at`, `deleted_by`, `deleted_at`) to null
   *
   * Does NOT validate business rules — call `validate()` or use `create()` for that.
   */
  constructor(dto: {
    id?: number | null;
    desc1: string;
    br_code: string;
    created_by: string;
    deleted_by?: string | null;
    updated_by?: string | null;
  }) {
    this.id = toNumber(dto.id);
    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.br_code = toLowerCaseString(dto.br_code) ?? '';
    this.created_by = toLowerCaseString(dto.created_by) ?? '';
    this.created_at = getPHDateTime();
    this.updated_by = null;
    this.updated_at = null;
    this.deleted_at = null;
    this.deleted_by = null;
  }

  /**
   * Static factory method — the preferred way to create a new Branch.
   *
   * Constructs and validates the branch in one step.
   * Throws `BranchBusinessException` if any business rule is violated.
   */
  static create(params: { desc1: string; br_code: string; created_by: string }): Branch {
    const branch = new Branch({
      desc1: params.desc1,
      br_code: params.br_code,
      created_by: params.created_by,
    });
    branch.validate();
    return branch;
  }

  /**
   * Updates the branch description, code, and audit fields.
   *
   * - Throws if the branch is currently archived.
   * - Normalizes inputs before applying.
   * - Validates the new state after applying changes.
   * - Refreshes `updated_at` to the current PH datetime.
   */
  update(dto: { desc1: string; br_code: string; updated_by?: string | null }): void {
    if (this.deleted_at) {
      throw new BranchBusinessException(
        'Branch is archived and cannot be updated.',
        HTTP_STATUS.CONFLICT,
      );
    }

    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.br_code = toLowerCaseString(dto.br_code) ?? '';
    this.updated_by = toLowerCaseString(dto.updated_by) ?? null;
    this.updated_at = getPHDateTime();

    this.validate();
  }

  /**
   * Soft-deletes the branch (archive).
   *
   * - Throws if the branch is already archived.
   * - Sets `deleted_at` to the current PH datetime.
   * - Records who performed the archive.
   */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new BranchBusinessException(
        'Branch is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = toLowerCaseString(deleted_by) ?? null;
  }

  /**
   * Restores an archived branch.
   *
   * - Throws if the branch is not currently archived.
   * - Clears `deleted_at` and `deleted_by`.
   */
  restore(): void {
    if (!this.deleted_at) {
      throw new BranchBusinessException(
        `Branch with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  /**
   * Enforces business rules on the current state.
   *
   * Called by `create()` and `update()`.
   * Throws `BranchBusinessException` with BAD_REQUEST on any violation.
   */
  validate(): void {
    // desc1 validations
    if (!this.desc1 || this.desc1.trim().length === 0) {
      throw new BranchBusinessException(
        'Branch description (desc1) is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.trim().length < 2) {
      throw new BranchBusinessException(
        'Branch description (desc1) must be at least 2 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.length > 255) {
      throw new BranchBusinessException(
        'Branch description (desc1) must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // br_code validations
    if (!this.br_code || this.br_code.trim().length === 0) {
      throw new BranchBusinessException(
        'Branch code (br_code) is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.br_code.length > 20) {
      throw new BranchBusinessException(
        'Branch code (br_code) must not exceed 20 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }
}