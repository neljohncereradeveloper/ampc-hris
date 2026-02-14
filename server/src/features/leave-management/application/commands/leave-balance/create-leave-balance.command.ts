/**
 * Command for creating a leave balance.
 */
export interface CreateLeaveBalanceCommand {
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
  status: string;
  remarks?: string;
}
