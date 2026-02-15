/**
 * One balance to create when generating balances for a year.
 * Caller builds this list (e.g. from active employees × active policies for the year).
 */
export interface GenerateBalancesForYearEntry {
  /** Employee who receives the balance. */
  employee_id: number;
  /** Leave type (e.g. VL, SL) this balance is for. */
  leave_type_id: number;
  /** Policy that defines entitlement and rules. */
  policy_id: number;
  /** Opening balance at start of year (default 0 if omitted). */
  beginning_balance?: number;
  /** Days earned for the year (default from policy if omitted). */
  earned?: number;
  /** Days used (default 0 if omitted). */
  used?: number;
  /** Days carried over from previous year (default 0 if omitted). */
  carried_over?: number;
  /** Days encashed (default 0 if omitted). */
  encashed?: number;
  /** Available days (default derived from other fields if omitted). */
  remaining?: number;
  /** Optional notes. */
  remarks?: string;
}
