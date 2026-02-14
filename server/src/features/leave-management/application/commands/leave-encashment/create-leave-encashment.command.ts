/**
 * Command for creating a leave encashment (status PENDING).
 */
export interface CreateLeaveEncashmentCommand {
  employee_id: number;
  balance_id: number;
  total_days: number;
  amount: number;
}
