import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { EnumLeaveBalanceStatus, EnumLeaveRequestStatus } from '../enum';
import { LeaveRequestBusinessException } from '../exceptions';
import type { LeaveBalance } from './leave-balance.model';

export class LeaveRequest {
  /** Primary key; set after persistence. */
  id?: number;
  /** Employee requesting leave. */
  employee_id: number;
  /** Leave type (e.g. VL, SL) being requested. */
  leave_type_id: number;
  /** Leave type name (denormalized for display). */
  leave_type?: string;
  /** First day of the leave period. */
  start_date: Date;
  /** Last day of the leave period. */
  end_date: Date;
  /** Number of leave days (business/calendar days as per policy). */
  total_days: number;
  /** Reason or purpose for the leave. */
  reason: string;
  /** Leave balance record that will be debited for this request. */
  balance_id: number;
  /** When the request was approved or rejected (if applicable). */
  approval_date?: Date;
  /** User/approver ID who approved or rejected (if applicable). */
  approval_by?: number;
  /** Optional remarks (e.g. from approver). */
  remarks?: string;
  /** Current state: PENDING, APPROVED, REJECTED, CANCELLED. */
  status: EnumLeaveRequestStatus;
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
    start_date: Date;
    end_date: Date;
    total_days: number;
    reason: string;
    balance_id: number;
    approval_date?: Date;
    approval_by?: number;
    remarks?: string;
    status: EnumLeaveRequestStatus;
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
    this.start_date = dto.start_date;
    this.end_date = dto.end_date;
    this.total_days = dto.total_days;
    this.reason = dto.reason;
    this.balance_id = dto.balance_id;
    this.approval_date = dto.approval_date;
    this.approval_by = dto.approval_by;
    this.remarks = dto.remarks;
    this.status = dto.status;
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
    start_date: Date;
    end_date: Date;
    total_days: number;
    reason: string;
    balance_id: number;
    remarks?: string;
    created_by?: string | null;
  }): LeaveRequest {
    const leave_request = new LeaveRequest({
      employee_id: params.employee_id,
      leave_type_id: params.leave_type_id,
      start_date: params.start_date,
      end_date: params.end_date,
      total_days: params.total_days,
      reason: params.reason,
      balance_id: params.balance_id,
      status: EnumLeaveRequestStatus.PENDING,
      remarks: params.remarks,
      created_by: params.created_by ?? null,
    });
    leave_request.validate();
    return leave_request;
  }

  update(dto: {
    start_date?: Date;
    end_date?: Date;
    total_days?: number;
    reason?: string;
    remarks?: string;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new LeaveRequestBusinessException(
        'Leave request is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }
    if (
      this.status === EnumLeaveRequestStatus.APPROVED ||
      this.status === EnumLeaveRequestStatus.REJECTED ||
      this.status === EnumLeaveRequestStatus.CANCELLED
    ) {
      throw new LeaveRequestBusinessException(
        'Leave request cannot be updated after approval, rejection, or cancellation.',
        HTTP_STATUS.CONFLICT,
      );
    }
    if (dto.start_date !== undefined) this.start_date = dto.start_date;
    if (dto.end_date !== undefined) this.end_date = dto.end_date;
    if (dto.total_days !== undefined) this.total_days = dto.total_days;
    if (dto.reason !== undefined) this.reason = dto.reason;
    if (dto.remarks !== undefined) this.remarks = dto.remarks;
    this.updated_by = dto.updated_by ?? null;
    this.validate();
  }

  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new LeaveRequestBusinessException(
        'Leave request is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;
  }

  restore(): void {
    if (!this.deleted_at) {
      throw new LeaveRequestBusinessException(
        `Leave request with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  validate(): void {
    if (!this.employee_id || this.employee_id <= 0) {
      throw new LeaveRequestBusinessException(
        'Employee ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.leave_type_id || this.leave_type_id <= 0) {
      throw new LeaveRequestBusinessException(
        'Leave type ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.start_date) {
      throw new LeaveRequestBusinessException(
        'Start date is required.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (
      !(this.start_date instanceof Date) ||
      isNaN(this.start_date.getTime())
    ) {
      throw new LeaveRequestBusinessException(
        'Start date must be a valid date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.end_date) {
      throw new LeaveRequestBusinessException(
        'End date is required.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!(this.end_date instanceof Date) || isNaN(this.end_date.getTime())) {
      throw new LeaveRequestBusinessException(
        'End date must be a valid date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.end_date < this.start_date) {
      throw new LeaveRequestBusinessException(
        'End date must be after or equal to start date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.total_days || this.total_days <= 0) {
      throw new LeaveRequestBusinessException(
        'Total days is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    const max_calendar_days = this.getCalendarDaysBetween(
      this.start_date,
      this.end_date,
    );
    if (this.total_days > max_calendar_days) {
      throw new LeaveRequestBusinessException(
        `Total days (${this.total_days}) cannot exceed calendar days in range (${max_calendar_days}).`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.reason || this.reason.trim().length === 0) {
      throw new LeaveRequestBusinessException(
        'Reason is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.reason.length > 500) {
      throw new LeaveRequestBusinessException(
        'Reason must not exceed 500 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.balance_id || this.balance_id <= 0) {
      throw new LeaveRequestBusinessException(
        'Balance ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (
      this.remarks !== undefined &&
      this.remarks !== null &&
      this.remarks !== ''
    ) {
      if (this.remarks.trim().length === 0) {
        throw new LeaveRequestBusinessException(
          'Remarks cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      if (this.remarks.length > 500) {
        throw new LeaveRequestBusinessException(
          'Remarks must not exceed 500 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }

  /**
   * Calendar days between start and end (inclusive). E.g. same day = 1, next day = 2.
   */
  private getCalendarDaysBetween(start: Date, end: Date): number {
    const ms_per_day = 24 * 60 * 60 * 1000;
    const start_utc = Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );
    const end_utc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    return Math.floor((end_utc - start_utc) / ms_per_day) + 1;
  }

  /**
   * Throws if the given balance cannot be used for this request.
   * Call before persisting a new or updated leave request with the balance that matches balance_id.
   *
   * Checks: balance identity (id), balance is usable (OPEN/REOPENED), and remaining >= total_days.
   */
  assertBalanceSufficient(balance: LeaveBalance): void {
    if (
      balance.id !== undefined &&
      this.balance_id !== undefined &&
      balance.id !== this.balance_id
    ) {
      throw new LeaveRequestBusinessException(
        'Balance does not match this request.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    const usableStatuses = [
      EnumLeaveBalanceStatus.OPEN,
      EnumLeaveBalanceStatus.REOPENED,
    ];
    if (!usableStatuses.includes(balance.status)) {
      throw new LeaveRequestBusinessException(
        'Leave balance is not available for use (closed or finalized).',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (balance.remaining < this.total_days) {
      throw new LeaveRequestBusinessException(
        `Insufficient leave balance: remaining ${balance.remaining}, requested ${this.total_days}.`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }
}
