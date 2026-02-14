import { LeaveBalance } from '../models/leave-balance.model';

export interface LeaveBalanceRepository<Context = unknown> {
  create(leave_balance: LeaveBalance, context: Context): Promise<LeaveBalance>;
  update(
    id: number,
    dto: Partial<LeaveBalance>,
    context: Context,
  ): Promise<boolean>;
  findById(id: number, context: Context): Promise<LeaveBalance | null>;
  findByEmployeeYear(
    employee_id: number,
    year: string,
    context: Context,
  ): Promise<LeaveBalance[]>;
  findByLeaveType(
    employee_id: number,
    leave_type_id: number,
    year: string,
    context: Context,
  ): Promise<LeaveBalance | null>;
  closeBalance(id: number, context: Context): Promise<boolean>;
  resetBalancesForYear(year: string, context: Context): Promise<boolean>;
}
