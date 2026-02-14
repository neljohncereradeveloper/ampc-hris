/**
 * One balance to create when generating balances for a year.
 * Caller builds this list (e.g. from active employees × active policies for the year).
 */
export interface GenerateBalancesForYearEntry {
  employee_id: number;
  leave_type_id: number;
  policy_id: number;
  beginning_balance?: number;
  earned?: number;
  used?: number;
  carried_over?: number;
  encashed?: number;
  remaining?: number;
  remarks?: string;
}
