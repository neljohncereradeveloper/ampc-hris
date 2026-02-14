import { LeaveTransaction } from '../models/leave-transaction.model';
import { EnumLeaveTransactionType } from '../enum';

export interface LeaveTransactionRepository<Context = unknown> {
  create(
    leave_transaction: LeaveTransaction,
    context: Context,
  ): Promise<LeaveTransaction>;
  findByBalance(
    balance_id: number,
    context: Context,
  ): Promise<LeaveTransaction[]>;
  recordTransaction(
    balance_id: number,
    type: EnumLeaveTransactionType,
    days: number,
    remarks: string,
    user_id: number,
    context: Context,
  ): Promise<LeaveTransaction>;
}
