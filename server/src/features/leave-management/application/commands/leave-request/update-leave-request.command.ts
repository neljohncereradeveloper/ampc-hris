/**
 * Command for updating a leave request (only when status is PENDING).
 */
export interface UpdateLeaveRequestCommand {
  start_date?: Date;
  end_date?: Date;
  total_days?: number;
  reason?: string;
  balance_id?: number;
  remarks?: string;
}
