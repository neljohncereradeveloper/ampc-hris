import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { JobtitleBusinessException } from '../exceptions/jobtitle-business.exception';
import { toLowerCaseString, toNumber } from '@/core/utils/coercion.util';

/**
 * Jobtitle domain entity.
 *
 * Encapsulates all business rules and state transitions for a jobtitle.
 * Use the static `create()` factory method to instantiate a validated jobtitle.
 */
export class Jobtitle {
  /** Auto-incremented primary key. Null when not yet persisted. */
  id?: number | null;

  /** Jobtitle description / name. */
  /** Example: Manager, Supervisor, etc. */
  desc1: string;

  /** Who created this jobtitle. Required at creation time. */
  created_by: string;

  /** Timestamp when this jobtitle was created. Always set on construction. */
  created_at: Date;

  /** Who last updated this jobtitle. Null until first update. */
  updated_by: string | null;

  /** Timestamp of the last update. Null until first update. */
  updated_at: Date | null;

  /** Who archived (soft-deleted) this jobtitle. Null if not archived. */
  deleted_by: string | null;

  /** Timestamp when this jobtitle was archived. Null if not archived. */
  deleted_at: Date | null;

  /**
   * Normalizes and initializes jobtitle fields from a raw DTO.
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
    created_by: string;
    deleted_by?: string | null;
    updated_by?: string | null;
  }) {
    this.id = toNumber(dto.id);
    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.created_by = toLowerCaseString(dto.created_by) ?? '';
    this.created_at = getPHDateTime();
    this.updated_by = null;
    this.updated_at = null;
    this.deleted_by = null;
    this.deleted_at = null;
  }

  /**
   * Static factory method — the preferred way to create a new Jobtitle.
   *
   * Constructs and validates the jobtitle in one step.
   * Throws `JobtitleBusinessException` if any business rule is violated.
   */
  static create(params: { desc1: string; created_by: string }): Jobtitle {
    const jobtitle = new Jobtitle({
      desc1: params.desc1,
      created_by: params.created_by,
    });
    jobtitle.validate();
    return jobtitle;
  }

  /**
   * Updates the jobtitle description and audit fields.
   *
   * - Throws if the jobtitle is currently archived.
   * - Normalizes inputs before applying.
   * - Validates the new state after applying changes.
   * - Refreshes `updated_at` to the current PH datetime.
   */
  update(dto: { desc1: string; updated_by?: string | null }): void {
    if (this.deleted_at) {
      throw new JobtitleBusinessException(
        'Jobtitle is archived and cannot be updated.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.updated_by = toLowerCaseString(dto.updated_by) ?? null;
    this.updated_at = getPHDateTime();

    this.validate();
  }

  /**
   * Soft-deletes the jobtitle (archive).
   *
   * - Throws if the jobtitle is already archived.
   * - Sets `deleted_at` to the current PH datetime.
   * - Records who performed the archive.
   */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new JobtitleBusinessException(
        'Jobtitle is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = toLowerCaseString(deleted_by) ?? null;
  }

  /**
   * Restores an archived jobtitle.
   *
   * - Throws if the jobtitle is not currently archived.
   * - Clears `deleted_at` and `deleted_by`.
   */
  restore(): void {
    if (!this.deleted_at) {
      throw new JobtitleBusinessException(
        `Jobtitle with ID ${this.id} is not archived.`,
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
   * Throws `JobtitleBusinessException` with BAD_REQUEST on any violation.
   */
  validate(): void {
    // desc1 validations
    if (!this.desc1 || this.desc1.trim().length === 0) {
      throw new JobtitleBusinessException(
        'Jobtitle description (desc1) is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.trim().length < 2) {
      throw new JobtitleBusinessException(
        'Jobtitle description (desc1) must be at least 2 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.length > 255) {
      throw new JobtitleBusinessException(
        'Jobtitle description (desc1) must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }
}
