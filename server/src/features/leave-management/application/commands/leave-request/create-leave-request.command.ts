
export interface CreateLeaveRequestCommand {
  /** Employee requesting the leave. */
  employee_id: number;
  /** Leave type code (e.g. "VL", "SL") used to resolve leave type and active policy. */
  leave_type_code: string;
  /** First day of the leave period. */
  start_date: Date;
  /** Last day of the leave period. */
  end_date: Date;
  /** When true and start_date === end_date, total_days = 0.5. Otherwise total_days is calculated from date range. */
  is_half_day?: boolean;
  /** Reason or purpose for the leave. */
  reason: string;
  /** Optional remarks. */
  remarks?: string;
}
