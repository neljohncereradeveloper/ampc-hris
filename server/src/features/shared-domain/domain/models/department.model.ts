import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { DepartmentBusinessException } from '../exceptions/department-business.exception';
import { toLowerCaseString, toNumber } from '@/core/utils/coercion.util';
import { DepartmentScope } from '../enum';

/**
 * Department domain entity.
 *
 * Encapsulates all business rules and state transitions for a department.
 *
 * Two ways to instantiate:
 * - `Department.create()` — for new departments (validates business rules)
 * - `Department.fromPersistence()` — for rehydrating from the database (no validation)
 */
export class Department {
  /** Auto-incremented primary key. Null when not yet persisted. */
  id?: number | null;

  /** Department description / name. e.g. 'human resources', 'information technology' */
  desc1: string;

  /** Unique department code identifier. e.g. 'hr', 'it', 'fin' */
  code: string;

  /**
   * Determines payroll grouping behavior.
   * HEAD_OFFICE = payroll grouped by department.
   * BRANCH = payroll grouped by branch.
   */
  scope: DepartmentScope;

  /** Optional remarks or additional info about the department. */
  remarks?: string;

  /** Who created this department. Required at creation time. */
  created_by: string;

  /**
   * Timestamp when this department was created.
   * Set temporarily in-memory on construction; TypeORM overrides this on INSERT via @CreateDateColumn.
   * Authoritative value comes from the database after persist.
   */
  created_at: Date;

  /** Who last updated this department. Null until first update. */
  updated_by: string | null;

  /**
   * Timestamp of the last update.
   * Set temporarily in-memory on construction; TypeORM overrides this on UPDATE via @UpdateDateColumn.
   * Authoritative value comes from the database after persist.
   */
  updated_at: Date;

  /** Who archived (soft-deleted) this department. Null if not archived. */
  deleted_by: string | null;

  /** Timestamp when this department was archived. Null if not archived. */
  deleted_at: Date | null;

  /**
   * Normalizes and initializes department fields from a raw DTO.
   *
   * Responsibilities:
   * - Coerces all string fields to lowercase via `toLowerCaseString`
   * - Defaults optional audit fields to null
   * - Sets in-memory timestamps for `created_at` and `updated_at` if not provided
   *
   * Note: `created_at` and `updated_at` are managed by TypeORM (@CreateDateColumn /
   * @UpdateDateColumn) at the DB level. Values set here are temporary and will be
   * overridden on persist. Authoritative values come back via `fromPersistence()`.
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
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
    deleted_by?: string | null;
    deleted_at?: Date | null;
  }) {
    this.id = toNumber(dto.id);
    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.code = toLowerCaseString(dto.code) ?? '';
    this.scope = dto.scope;
    this.remarks =
      dto.remarks !== undefined
        ? (toLowerCaseString(dto.remarks) ?? undefined)
        : undefined;
    this.created_by = toLowerCaseString(dto.created_by) ?? '';
    this.created_at = dto.created_at ?? getPHDateTime(); // temporary; TypeORM overrides on INSERT
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime(); // temporary; TypeORM overrides on UPDATE
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
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
   * Rehydrates a Department from a raw database record.
   *
   * Used in repository `entityToModel()` to map DB rows back to the domain model.
   * Bypasses validation since data from the DB is already assumed to be valid.
   */
  static fromPersistence(entity: Record<string, unknown>): Department {
    return new Department({
      id: entity.id as number,
      desc1: entity.desc1 as string,
      code: entity.code as string,
      scope: entity.scope as DepartmentScope,
      remarks: entity.remarks as string | undefined,
      created_by: entity.created_by as string,
      created_at: entity.created_at as Date,
      updated_by: entity.updated_by as string | null,
      updated_at: entity.updated_at as Date,
      deleted_by: entity.deleted_by as string | null,
      deleted_at: entity.deleted_at as Date | null,
    });
  }

  /**
   * Updates the department details and audit fields.
   *
   * - Throws if the department is currently archived.
   * - Normalizes inputs before applying.
   * - Validates the new state after applying changes.
   * - Note: `updated_at` is managed by TypeORM (@UpdateDateColumn), not set here.
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
    this.remarks =
      dto.remarks !== undefined
        ? (toLowerCaseString(dto.remarks) ?? undefined)
        : undefined;
    this.updated_by = toLowerCaseString(dto.updated_by) ?? null;

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
