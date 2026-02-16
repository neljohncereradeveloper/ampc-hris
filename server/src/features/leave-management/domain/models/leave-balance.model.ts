import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { EnumLeaveBalanceStatus } from '../enum';
import { LeaveBalanceBusinessException } from '../exceptions';

export class LeaveBalance {
  /** Primary key; set after persistence. */
  id?: number;
  /** Employee who owns this balance. */
  employee_id: number;
  /** Leave type (e.g. VL, SL) this balance applies to. */
  leave_type_id: number;
  /** Leave type name (denormalized for display). */
  leave_type?: string;
  /** Policy that defines entitlement and rules for this balance. */
  policy_id: number;
  /** Leave year (e.g. "2025") this balance is for. */
  year: string;
  /** Opening balance at the start of the year (before earned/carried_over). */
  beginning_balance: number;
  /** Days earned for this year (from policy entitlement). */
  earned: number;
  /** Days consumed by approved leave in this year. */
  used: number;
  /** Days brought forward from the previous year (within carry limit). */
  carried_over: number;
  /** Days encashed (converted to pay) in this year. */
  encashed: number;
  /** Available days: (beginning_balance + earned + carried_over) - (used + encashed). */
  remaining: number;
  /** Date of the last transaction that changed this balance. */
  last_transaction_date?: Date;
  /** Current state: OPEN, CLOSED, REOPENED, etc. */
  status: EnumLeaveBalanceStatus;
  /** Optional notes (e.g. adjustment reason). */
  remarks?: string;
  /** User who soft-deleted this record. */
  deleted_by: string | null;
  /** When this record was soft-deleted. */
  deleted_at: Date | null;
  /** User who created this record. */
  created_by: string | null;
  /** When this record was created. */
  created_at: Date;
  /** User who last updated this record. */
  updated_by: string | null;
  /** When this record was last updated. */
  updated_at: Date;

  constructor(dto: {
    id?: number;
    employee_id: number;
    leave_type_id: number;
    leave_type?: string;
    policy_id: number;
    year: string;
    beginning_balance: number;
    earned: number;
    used: number;
    carried_over: number;
    encashed: number;
    remaining: number;
    last_transaction_date?: Date;
    status: EnumLeaveBalanceStatus;
    remarks?: string;
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = dto.id;
    this.employee_id = dto.employee_id;
    this.leave_type_id = dto.leave_type_id;
    this.leave_type = dto.leave_type;
    this.policy_id = dto.policy_id;
    this.year = dto.year;
    this.beginning_balance = dto.beginning_balance;
    this.earned = dto.earned;
    this.used = dto.used;
    this.carried_over = dto.carried_over;
    this.encashed = dto.encashed;
    this.remaining = dto.remaining;
    this.last_transaction_date = dto.last_transaction_date;
    this.status = dto.status;
    this.remarks = dto.remarks;
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
    this.created_by = dto.created_by ?? null;
    this.created_at = dto.created_at ?? getPHDateTime();
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime();
  }

  static create(params: {
    employee_id: number;
    leave_type_id: number;
    policy_id: number;
    year: string;
    beginning_balance: number;
    earned: number;
    used: number;
    carried_over: number;
    encashed: number;
    remaining: number;
    status: EnumLeaveBalanceStatus;
    remarks?: string;
    created_by?: string | null;
  }): LeaveBalance {
    const leave_balance = new LeaveBalance({
      employee_id: params.employee_id,
      leave_type_id: params.leave_type_id,
      policy_id: params.policy_id,
      year: params.year,
      beginning_balance: params.beginning_balance,
      earned: params.earned,
      used: params.used,
      carried_over: params.carried_over,
      encashed: params.encashed,
      remaining: params.remaining,
      status: params.status,
      remarks: params.remarks,
      created_by: params.created_by ?? null,
    });
    leave_balance.validate();
    return leave_balance;
  }

  update(dto: {
    earned?: number;
    used?: number;
    carried_over?: number;
    encashed?: number;
    remaining?: number;
    last_transaction_date?: Date;
    status?: EnumLeaveBalanceStatus;
    remarks?: string;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new LeaveBalanceBusinessException(
        'Leave balance is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }
    if (dto.earned !== undefined) this.earned = dto.earned;
    if (dto.used !== undefined) this.used = dto.used;
    if (dto.carried_over !== undefined) this.carried_over = dto.carried_over;
    if (dto.encashed !== undefined) this.encashed = dto.encashed;
    if (dto.remaining !== undefined) this.remaining = dto.remaining;
    if (dto.last_transaction_date !== undefined)
      this.last_transaction_date = dto.last_transaction_date;
    if (dto.status !== undefined) this.status = dto.status;
    if (dto.remarks !== undefined) this.remarks = dto.remarks;
    this.updated_by = dto.updated_by ?? null;
    this.validate();
  }

  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new LeaveBalanceBusinessException(
        'Leave balance is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;
  }

  restore(): void {
    if (!this.deleted_at) {
      throw new LeaveBalanceBusinessException(
        `Leave balance with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  validate(): void {
    if (!this.employee_id || this.employee_id <= 0) {
      throw new LeaveBalanceBusinessException(
        'Employee ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.leave_type_id || this.leave_type_id <= 0) {
      throw new LeaveBalanceBusinessException(
        'Leave type ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.policy_id || this.policy_id <= 0) {
      throw new LeaveBalanceBusinessException(
        'Policy ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.year || this.year.trim().length === 0) {
      throw new LeaveBalanceBusinessException(
        'Year is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.year.length > 20) {
      throw new LeaveBalanceBusinessException(
        'Year must not exceed 20 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.beginning_balance < 0) {
      throw new LeaveBalanceBusinessException(
        'Beginning balance must be a non-negative number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.earned < 0) {
      throw new LeaveBalanceBusinessException(
        'Earned must be a non-negative number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.used < 0) {
      throw new LeaveBalanceBusinessException(
        'Used must be a non-negative number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.carried_over < 0) {
      throw new LeaveBalanceBusinessException(
        'Carried over must be a non-negative number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.encashed < 0) {
      throw new LeaveBalanceBusinessException(
        'Encashed must be a non-negative number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.remaining < 0) {
      throw new LeaveBalanceBusinessException(
        'Remaining must be a non-negative number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    const expected_remaining =
      this.beginning_balance +
      this.earned +
      this.carried_over -
      this.used -
      this.encashed;
    if (this.remaining !== expected_remaining) {
      throw new LeaveBalanceBusinessException(
        `Remaining (${this.remaining}) must equal (beginning_balance + earned + carried_over) - (used + encashed) = ${expected_remaining}.`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (
      this.last_transaction_date != null &&
      (!(this.last_transaction_date instanceof Date) ||
        isNaN(this.last_transaction_date.getTime()))
    ) {
      throw new LeaveBalanceBusinessException(
        'Last transaction date must be a valid date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.remarks != null && this.remarks !== undefined) {
      if (this.remarks.trim().length === 0) {
        throw new LeaveBalanceBusinessException(
          'Remarks cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      if (this.remarks.length > 500) {
        throw new LeaveBalanceBusinessException(
          'Remarks must not exceed 500 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }
}
