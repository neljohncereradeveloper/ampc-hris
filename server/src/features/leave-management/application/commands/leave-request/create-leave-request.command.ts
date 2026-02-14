/**
 * Command for creating a leave request (always created as PENDING).
 * Leave type is resolved from shared domain by code (e.g. "VL", "SL").
 * total_days is calculated from start_date/end_date (excluding holidays and policy excluded_weekdays).
 */
export interface CreateLeaveRequestCommand {
  employee_id: number;
  leave_type_code: string;
  start_date: Date;
  end_date: Date;
  /** When true and start_date === end_date, total_days = 0.5. Otherwise total_days is calculated from date range. */
  is_half_day?: boolean;
  reason: string;
  balance_id: number;
  remarks?: string;
}
