import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { EnumLeaveEncashmentStatus } from '../enum';
import { LeaveEncashmentBusinessException } from '../exceptions';

export class LeaveEncashment {
  /** Primary key; set after persistence. */
  id?: number;
  /** Employee whose leave is being encashed. */
  employee_id: number;
  /** Leave balance record being debited for this encashment. */
  balance_id: number;
  /** Number of leave days being converted to pay. */
  total_days: number;
  /** Monetary amount paid for the encashed days. */
  amount: number;
  /** Current state: PENDING, PAID, etc. */
  status: EnumLeaveEncashmentStatus;
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
    balance_id: number;
    total_days: number;
    amount: number;
    status: EnumLeaveEncashmentStatus;
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = dto.id;
    this.employee_id = dto.employee_id;
    this.balance_id = dto.balance_id;
    this.total_days = dto.total_days;
    this.amount = dto.amount;
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
    balance_id: number;
    total_days: number;
    amount: number;
    status: EnumLeaveEncashmentStatus;
    created_by?: string | null;
  }): LeaveEncashment {
    const leave_encashment = new LeaveEncashment({
      employee_id: params.employee_id,
      balance_id: params.balance_id,
      total_days: params.total_days,
      amount: params.amount,
      status: params.status,
      created_by: params.created_by ?? null,
    });
    leave_encashment.validate();
    return leave_encashment;
  }

  update(dto: {
    total_days?: number;
    amount?: number;
    status?: EnumLeaveEncashmentStatus;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new LeaveEncashmentBusinessException(
        'Leave encashment is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }
    if (this.status === EnumLeaveEncashmentStatus.PAID) {
      throw new LeaveEncashmentBusinessException(
        'Leave encashment cannot be updated after payment.',
        HTTP_STATUS.CONFLICT,
      );
    }
    if (dto.status === EnumLeaveEncashmentStatus.PAID) {
      throw new LeaveEncashmentBusinessException(
        'Status cannot be set to PAID via update; use the mark-as-paid flow instead.',
        HTTP_STATUS.CONFLICT,
      );
    }
    if (dto.total_days !== undefined) this.total_days = dto.total_days;
    if (dto.amount !== undefined) this.amount = dto.amount;
    if (dto.status !== undefined) this.status = dto.status;
    this.updated_by = dto.updated_by ?? null;
    this.validate();
  }

  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new LeaveEncashmentBusinessException(
        'Leave encashment is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    if (this.status === EnumLeaveEncashmentStatus.PAID) {
      throw new LeaveEncashmentBusinessException(
        'Leave encashment cannot be archived after payment.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;
  }

  restore(): void {
    if (!this.deleted_at) {
      throw new LeaveEncashmentBusinessException(
        `Leave encashment with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  validate(): void {
    if (!this.employee_id || this.employee_id <= 0) {
      throw new LeaveEncashmentBusinessException(
        'Employee ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.balance_id || this.balance_id <= 0) {
      throw new LeaveEncashmentBusinessException(
        'Balance ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.total_days || this.total_days <= 0) {
      throw new LeaveEncashmentBusinessException(
        'Total days is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.amount < 0) {
      throw new LeaveEncashmentBusinessException(
        'Amount must be a non-negative number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }
}
