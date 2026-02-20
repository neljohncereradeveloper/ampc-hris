import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { LeaveTypeBusinessException } from '../exceptions/leave-type-business.exception';
import { toLowerCaseString, toNumber } from '@/core/utils/coercion.util';

/**
 * LeaveType domain entity.
 *
 * Encapsulates all business rules and state transitions for a leave type.
 *
 * Two ways to instantiate:
 * - `LeaveType.create()` — for new leave types (validates business rules)
 * - `LeaveType.fromPersistence()` — for rehydrating from the database (no validation)
 */
export class LeaveType {
  /** Auto-incremented primary key. Null when not yet persisted. */
  id?: number | null;

  /** Leave type name (unique, required). */
  name: string;

  /** Leave type code (unique, required). */
  code: string;

  /** Leave type description / details. */
  desc1: string;

  /** True if this leave type is paid. */
  paid: boolean;

  /** Remarks for this leave type. Optional. */
  remarks?: string | null;

  /** Who created this leave type. Required at creation time. */
  created_by: string;

  /**
   * Timestamp when this leave type was created.
   * Set temporarily in-memory on construction; TypeORM overrides this on INSERT via @CreateDateColumn.
   * Authoritative value comes from the database after persist.
   */
  created_at: Date;

  /** Who last updated this leave type. Null until first update. */
  updated_by: string | null;

  /**
   * Timestamp of the last update.
   * Set temporarily in-memory on construction; TypeORM overrides this on UPDATE via @UpdateDateColumn.
   * Authoritative value comes from the database after persist.
   */
  updated_at: Date;

  /** Who archived (soft-deleted) this leave type. Null if not archived. */
  deleted_by: string | null;

  /** Timestamp when this leave type was archived. Null if not archived. */
  deleted_at: Date | null;

  /**
   * Normalizes and initializes LeaveType fields from a raw DTO.
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
    name: string;
    code: string;
    desc1: string;
    paid: boolean;
    remarks?: string | null;
    created_by: string;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
    deleted_by?: string | null;
    deleted_at?: Date | null;
  }) {
    this.id = toNumber(dto.id);
    this.name = toLowerCaseString(dto.name) ?? '';
    this.code = toLowerCaseString(dto.code) ?? '';
    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.paid = dto.paid;
    this.remarks = dto.remarks ? toLowerCaseString(dto.remarks) : null;
    this.created_by = toLowerCaseString(dto.created_by) ?? '';
    this.created_at = dto.created_at ?? getPHDateTime(); // temporary; TypeORM overrides on INSERT
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime(); // temporary; TypeORM overrides on UPDATE
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
  }

  /**
   * Static factory method — the preferred way to create a new LeaveType.
   *
   * Constructs and validates the leave type in one step.
   * Throws `LeaveTypeBusinessException` if any business rule is violated.
   */
  static create(params: {
    name: string;
    code: string;
    desc1: string;
    paid: boolean;
    remarks?: string | null;
    created_by: string;
  }): LeaveType {
    const leaveType = new LeaveType({
      name: params.name,
      code: params.code,
      desc1: params.desc1,
      paid: params.paid,
      remarks: params.remarks ?? null,
      created_by: params.created_by,
    });
    leaveType.validate();
    return leaveType;
  }

  /**
   * Rehydrates a LeaveType from a raw database record.
   *
   * Used in repository `entityToModel()` to map DB rows back to the domain model.
   * Bypasses validation since data from the DB is already assumed to be valid.
   */
  static fromPersistence(entity: Record<string, unknown>): LeaveType {
    return new LeaveType({
      id: entity.id as number,
      name: entity.name as string,
      code: entity.code as string,
      desc1: entity.desc1 as string,
      paid: entity.paid as boolean,
      remarks: entity.remarks as string | null,
      created_by: entity.created_by as string,
      created_at: entity.created_at as Date,
      updated_by: entity.updated_by as string | null,
      updated_at: entity.updated_at as Date,
      deleted_by: entity.deleted_by as string | null,
      deleted_at: entity.deleted_at as Date | null,
    });
  }

  /**
   * Updates the leave type details and audit fields.
   *
   * - Throws if the leave type is currently archived.
   * - Normalizes inputs before applying.
   * - Validates the new state after applying changes.
   * - Note: `updated_at` is managed by TypeORM (@UpdateDateColumn), not set here.
   */
  update(dto: {
    name: string;
    code: string;
    desc1: string;
    paid: boolean;
    remarks?: string | null;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new LeaveTypeBusinessException(
        'Leave type is archived and cannot be updated.',
        HTTP_STATUS.CONFLICT,
      );
    }

    this.name = toLowerCaseString(dto.name) ?? '';
    this.code = toLowerCaseString(dto.code) ?? '';
    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.paid = dto.paid;
    this.remarks = dto.remarks ? toLowerCaseString(dto.remarks) : null;
    this.updated_by = toLowerCaseString(dto.updated_by) ?? null;

    this.validate();
  }

  /**
   * Soft-deletes the leave type (archive).
   *
   * - Throws if the leave type is already archived.
   * - Sets `deleted_at` to the current PH datetime.
   * - Records who performed the archive.
   */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new LeaveTypeBusinessException(
        'Leave type is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = toLowerCaseString(deleted_by) ?? null;
  }

  /**
   * Restores an archived leave type.
   *
   * - Throws if the leave type is not currently archived.
   * - Clears `deleted_at` and `deleted_by`.
   */
  restore(): void {
    if (!this.deleted_at) {
      throw new LeaveTypeBusinessException(
        `Leave type with ID ${this.id} is not archived.`,
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
   * Throws `LeaveTypeBusinessException` with BAD_REQUEST on any violation.
   */
  validate(): void {
    // name validations
    if (!this.name || this.name.trim().length === 0) {
      throw new LeaveTypeBusinessException(
        'Leave type name is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.name.trim().length < 2) {
      throw new LeaveTypeBusinessException(
        'Leave type name must be at least 2 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.name.length > 100) {
      throw new LeaveTypeBusinessException(
        'Leave type name must not exceed 100 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // code validations
    if (!this.code || this.code.trim().length === 0) {
      throw new LeaveTypeBusinessException(
        'Leave type code is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.code.length > 50) {
      throw new LeaveTypeBusinessException(
        'Leave type code must not exceed 50 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // desc1 validations
    if (!this.desc1 || this.desc1.trim().length === 0) {
      throw new LeaveTypeBusinessException(
        'Leave type description (desc1) is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.trim().length < 2) {
      throw new LeaveTypeBusinessException(
        'Leave type description (desc1) must be at least 2 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.length > 255) {
      throw new LeaveTypeBusinessException(
        'Leave type description (desc1) must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // remarks validations - only if provided
    if (this.remarks !== undefined && this.remarks !== null) {
      if (this.remarks.trim().length === 0) {
        throw new LeaveTypeBusinessException(
          'Remarks cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      if (this.remarks.length > 500) {
        throw new LeaveTypeBusinessException(
          'Remarks must not exceed 500 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }
}
