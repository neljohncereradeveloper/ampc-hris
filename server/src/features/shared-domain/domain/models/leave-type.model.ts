import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { LeaveTypeBusinessException } from '../exceptions/leave-type-business.exception';
import { toLowerCaseString, toNumber } from '@/core/utils/coercion.util';

/**
 * LeaveType domain entity.
 *
 * Encapsulates all business rules and state transitions for a leave type.
 * Use the static `create()` factory method to instantiate a validated leave type.
 */
export class LeaveType {
  /** Auto-incremented primary key. Null when not yet persisted. */
  id?: number | null;

  /** Leave type name (unique, required). */
  /** Example: Sick Leave, Vacation Leave, etc. */
  name: string;

  /** Leave type code (unique, required). */
  /** Example: SL, VL, ML, PL, SPL, BL, EL, STL, UL */
  code: string;

  /** Leave type description / details. */
  /** Example: Sick Leave, Vacation Leave, etc. */
  desc1: string;

  /** True if this leave type is paid. */
  /** Example: true for paid leave types, false for unpaid leave types */
  paid: boolean;

  /** Remarks for this leave type. Optional. */
  /** Example: 5 days for employees with at least 1 year service (art. 95, labor code), 105 days (ra 11210); extendible unpaid, 7 days (ra 8187) for legitimate child, 7 days per year (ra 8972), Typically 3–5 days for immediate family, leave without pay */
  remarks?: string | null;

  /** Who created this leave type. Required at creation time. */
  created_by: string;

  /** Timestamp when this leave type was created. Always set on construction. */
  created_at: Date;

  /** Who last updated this leave type. Null until first update. */
  updated_by: string | null;

  /** Timestamp of the last update. Null until first update. */
  updated_at: Date | null;

  /** Who archived (soft-deleted) this leave type. Null if not archived. */
  deleted_by: string | null;

  /** Timestamp when this leave type was archived. Null if not archived. */
  deleted_at: Date | null;

  /**
   * Normalizes and initializes LeaveType fields from a raw DTO.
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
    name: string;
    code: string;
    desc1: string;
    paid: boolean;
    remarks?: string | null;
    created_by: string;
    deleted_by?: string | null;
    updated_by?: string | null;
  }) {
    this.id = toNumber(dto.id);
    this.name = toLowerCaseString(dto.name) ?? '';
    this.code = toLowerCaseString(dto.code) ?? '';
    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.paid = dto.paid;
    this.remarks = dto.remarks ? toLowerCaseString(dto.remarks) : null;
    this.created_by = toLowerCaseString(dto.created_by) ?? '';
    this.created_at = getPHDateTime();
    this.updated_by = null;
    this.updated_at = null;
    this.deleted_at = null;
    this.deleted_by = null;
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
      created_by: params.created_by
    });
    leaveType.validate();
    return leaveType;
  }

  /**
   * Updates the leave type details and audit fields.
   *
   * - Throws if the leave type is currently archived.
   * - Normalizes inputs before applying.
   * - Validates the new state after applying changes.
   * - Refreshes `updated_at` to the current PH datetime.
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
    this.updated_at = getPHDateTime();

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
