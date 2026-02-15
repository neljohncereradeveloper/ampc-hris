import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { EnumLeaveTransactionType } from '../enum';
import { LeaveTransactionBusinessException } from '../exceptions';

export class LeaveTransaction {
  /** Primary key; set after persistence. */
  id?: number;
  /** Leave balance record affected by this transaction. */
  balance_id: number;
  /** Kind of movement: e.g. EARN, USE, CARRY_OVER, ENCASH, ADJUSTMENT. */
  transaction_type: EnumLeaveTransactionType;
  /** Number of days added or deducted (signed per transaction type). */
  days: number;
  /** Reason or reference for the transaction. */
  remarks: string;
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
    balance_id: number;
    transaction_type: EnumLeaveTransactionType;
    days: number;
    remarks: string;
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = dto.id;
    this.balance_id = dto.balance_id;
    this.transaction_type = dto.transaction_type;
    this.days = dto.days;
    this.remarks = dto.remarks;
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
    this.created_by = dto.created_by ?? null;
    this.created_at = dto.created_at ?? getPHDateTime();
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime();
  }

  static create(params: {
    balance_id: number;
    transaction_type: EnumLeaveTransactionType;
    days: number;
    remarks: string;
    created_by?: string | null;
  }): LeaveTransaction {
    const leave_transaction = new LeaveTransaction({
      balance_id: params.balance_id,
      transaction_type: params.transaction_type,
      days: params.days,
      remarks: params.remarks,
      created_by: params.created_by ?? null,
    });
    leave_transaction.validate();
    return leave_transaction;
  }

  update(dto: { days?: number; remarks?: string; updated_by?: string | null }): void {
    if (this.deleted_at) {
      throw new LeaveTransactionBusinessException(
        'Leave transaction is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }
    if (dto.days !== undefined) this.days = dto.days;
    if (dto.remarks !== undefined) this.remarks = dto.remarks;
    this.updated_by = dto.updated_by ?? null;
    this.validate();
  }

  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new LeaveTransactionBusinessException(
        'Leave transaction is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;
  }

  restore(): void {
    if (!this.deleted_at) {
      throw new LeaveTransactionBusinessException(
        `Leave transaction with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  validate(): void {
    if (!this.balance_id || this.balance_id <= 0) {
      throw new LeaveTransactionBusinessException(
        'Balance ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.transaction_type) {
      throw new LeaveTransactionBusinessException(
        'Transaction type is required.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.days === 0) {
      throw new LeaveTransactionBusinessException(
        'Days must be a non-zero number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    switch (this.transaction_type) {
      case EnumLeaveTransactionType.REQUEST:
      case EnumLeaveTransactionType.ENCASHMENT:
        if (this.days > 0) {
          throw new LeaveTransactionBusinessException(
            `Transaction type ${this.transaction_type} must have negative days (debit).`,
            HTTP_STATUS.BAD_REQUEST,
          );
        }
        break;
      case EnumLeaveTransactionType.CARRY:
        if (this.days < 0) {
          throw new LeaveTransactionBusinessException(
            'Transaction type CARRY must have positive days (credit).',
            HTTP_STATUS.BAD_REQUEST,
          );
        }
        break;
      case EnumLeaveTransactionType.ADJUSTMENT:
        break;
    }
    if (!this.remarks || this.remarks.trim().length === 0) {
      throw new LeaveTransactionBusinessException(
        'Remarks is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.remarks.length > 500) {
      throw new LeaveTransactionBusinessException(
        'Remarks must not exceed 500 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }
}
