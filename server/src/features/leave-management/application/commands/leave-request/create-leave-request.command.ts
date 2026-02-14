/**
 * Command for creating a leave request (always created as PENDING).
 */
export interface CreateLeaveRequestCommand {
  employee_id: number;
  leave_type_id: number;
  start_date: Date;
  end_date: Date;
  total_days: number;
  reason: string;
  balance_id: number;
  remarks?: string;
}
