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
  /** Annual entitlement for the leave type. */
  annual_entitlement: number;
  /** Available days (default derived from other fields if omitted). */
  remaining?: number;
  /** Optional notes. */
  remarks?: string;
}
