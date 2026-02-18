/**
 * Command for updating a leave request (only when status is PENDING).
 * When start_date or end_date are provided, total_days is calculated from the date range
 * (excluding holidays and policy excluded_weekdays). Use is_half_day when updating to a single day.
 */
export interface UpdateLeaveRequestCommand {
  /** New first day of the leave period (optional). */
  start_date?: Date;
  /** New last day of the leave period (optional). */
  end_date?: Date;
  /** When true and start_date === end_date, total_days = 0.5. Only used when dates are updated. */
  is_half_day: boolean;
  /** New reason or purpose for the leave (optional). */
  reason?: string;
  /** Optional remarks. */
  remarks?: string;
}
