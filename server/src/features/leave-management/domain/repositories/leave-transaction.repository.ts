import { LeaveTransaction } from '../models/leave-transaction.model';
import { EnumLeaveTransactionType } from '../enum';

/**
 * Persistence for leave transactions (audit trail of balance changes).
 * Process: implementations use Context for transaction; recordTransaction typically creates a transaction row and updates the balance.
 */
export interface LeaveTransactionRepository<Context = unknown> {
  /**
   * Persist a new leave transaction record.
   * @param leave_transaction - Domain model to persist
   * @param context - Transaction or connection
   */
  create(
    leave_transaction: LeaveTransaction,
    context: Context,
  ): Promise<LeaveTransaction>;

  /**
   * Load all transactions for a balance (for history/audit).
   * @param balance_id - Leave balance primary key
   * @param context - Transaction or connection
   */
  findByBalance(
    balance_id: number,
    context: Context,
  ): Promise<LeaveTransaction[]>;

  /**
   * Record a balance movement (e.g. EARN, USE, CARRY_OVER, ENCASH) and persist the transaction.
   * @param balance_id - Leave balance to update
   * @param type - Transaction type (EARN, USE, CARRY_OVER, ENCASH, ADJUSTMENT, etc.)
   * @param days - Number of days (signed per type)
   * @param remarks - Reason or reference
   * @param user_id - User who triggered the transaction
   * @param context - Transaction or connection
   */
  recordTransaction(
    balance_id: number,
    type: EnumLeaveTransactionType,
    days: number,
    remarks: string,
    user_id: number,
    context: Context,
  ): Promise<LeaveTransaction>;
}
