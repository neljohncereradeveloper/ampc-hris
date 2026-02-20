import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { DepartmentBusinessException } from '../exceptions/department-business.exception';
import { toLowerCaseString, toNumber } from '@/core/utils/coercion.util';
import { DepartmentScope } from '../enum';

/**
 * Department domain entity.
 *
 * Encapsulates all business rules and state transitions for a department.
 * Use the static `create()` factory method to instantiate a validated department.
 */
export class Department {
  /** Auto-incremented primary key. Null when not yet persisted. */
  id?: number | null;

  /** Department description / name. e.g. 'human resources', 'information technology' */
  /** Example: Human Resources, Information Technology, etc. */
  desc1: string;

  /** Unique department code identifier. e.g. 'hr', 'it', 'fin' */
  /** Example: HR, IT, FIN, etc. */
  code: string;

  /**
   * Determines payroll grouping behavior.
   * HEAD_OFFICE = payroll grouped by department.
   * BRANCH = payroll grouped by branch.
   */
  /** Example: HEAD_OFFICE, BRANCH, etc. */
  scope: DepartmentScope;

  /** Optional remarks or additional info about the department. */
  /** Example: Human Resources Department, Information Technology Department, etc. */
  remarks?: string;

  /** Who created this department. Required at creation time. */
  created_by: string;

  /** Timestamp when this department was created. Always set on construction. */
  created_at: Date;

  /** Who last updated this department. Null until first update. */
  updated_by: string | null;

  /** Timestamp of the last update. Null until first update. */
  updated_at: Date | null;

  /** Who archived (soft-deleted) this department. Null if not archived. */
  deleted_by: string | null;

  /** Timestamp when this department was archived. Null if not archived. */
  deleted_at: Date | null;

  /**
   * Normalizes and initializes department fields from a raw DTO.
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
    code: string;
    scope: DepartmentScope;
    remarks?: string;
    created_by: string;
    deleted_by?: string | null;
    updated_by?: string | null;
  }) {
    this.id = toNumber(dto.id);
    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.code = toLowerCaseString(dto.code) ?? '';
    this.scope = dto.scope;
    this.remarks = dto.remarks !== undefined ? toLowerCaseString(dto.remarks) ?? undefined : undefined;
    this.created_by = toLowerCaseString(dto.created_by) ?? '';
    this.created_at = getPHDateTime();
    this.updated_by = null;
    this.updated_at = null;
    this.deleted_at = null;
    this.deleted_by = null;
  }

  /**
   * Static factory method — the preferred way to create a new Department.
   *
   * Constructs and validates the department in one step.
   * Throws `DepartmentBusinessException` if any business rule is violated.
   */
  static create(params: {
    desc1: string;
    code: string;
    scope: DepartmentScope;
    remarks?: string;
    created_by: string;
  }): Department {
    const department = new Department({
      desc1: params.desc1,
      code: params.code,
      scope: params.scope,
      remarks: params.remarks,
      created_by: params.created_by,
    });
    department.validate();
    return department;
  }

  /**
   * Updates the department details and audit fields.
   *
   * - Throws if the department is currently archived.
   * - Normalizes inputs before applying.
   * - Validates the new state after applying changes.
   * - Refreshes `updated_at` to the current PH datetime.
   */
  update(dto: {
    desc1: string;
    code: string;
    scope: DepartmentScope;
    remarks?: string;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new DepartmentBusinessException(
        'Department is archived and cannot be updated.',
        HTTP_STATUS.CONFLICT,
      );
    }

    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.code = toLowerCaseString(dto.code) ?? '';
    this.scope = dto.scope;
    this.remarks = dto.remarks !== undefined ? toLowerCaseString(dto.remarks) ?? undefined : undefined;
    this.updated_by = toLowerCaseString(dto.updated_by) ?? null;
    this.updated_at = getPHDateTime();

    this.validate();
  }

  /**
   * Soft-deletes the department (archive).
   *
   * - Throws if the department is already archived.
   * - Sets `deleted_at` to the current PH datetime.
   * - Records who performed the archive.
   */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new DepartmentBusinessException(
        'Department is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = toLowerCaseString(deleted_by) ?? null;
  }

  /**
   * Restores an archived department.
   *
   * - Throws if the department is not currently archived.
   * - Clears `deleted_at` and `deleted_by`.
   */
  restore(): void {
    if (!this.deleted_at) {
      throw new DepartmentBusinessException(
        `Department with ID ${this.id} is not archived.`,
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
   * Throws `DepartmentBusinessException` with BAD_REQUEST on any violation.
   */
  validate(): void {
    // desc1 validations
    if (!this.desc1 || this.desc1.trim().length === 0) {
      throw new DepartmentBusinessException(
        'Department description (desc1) is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.trim().length < 2) {
      throw new DepartmentBusinessException(
        'Department description (desc1) must be at least 2 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.length > 255) {
      throw new DepartmentBusinessException(
        'Department description (desc1) must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // code validations
    if (!this.code || this.code.trim().length === 0) {
      throw new DepartmentBusinessException(
        'Department code is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.code.length > 50) {
      throw new DepartmentBusinessException(
        'Department code must not exceed 50 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // scope validation
    const validScopes = Object.values(DepartmentScope);
    if (!validScopes.includes(this.scope)) {
      throw new DepartmentBusinessException(
        `Department scope must be one of: ${validScopes.join(', ')}.`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // remarks validations (optional, if provided)
    if (this.remarks !== undefined && this.remarks !== null) {
      if (this.remarks.trim().length === 0) {
        throw new DepartmentBusinessException(
          'Department remarks cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      if (this.remarks.trim().length < 2) {
        throw new DepartmentBusinessException(
          'Department remarks must be at least 2 characters long.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      if (this.remarks.length > 500) {
        throw new DepartmentBusinessException(
          'Department remarks must not exceed 500 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }
}