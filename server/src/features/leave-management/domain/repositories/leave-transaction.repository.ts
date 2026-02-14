import { LeaveTransaction } from '../models/leave-transaction.model';

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
    type: 'earn' | 'use' | 'carry_over' | 'encash',
    days: number,
    remarks: string,
    user_id: number,
    context: Context,
  ): Promise<LeaveTransaction>;
}
