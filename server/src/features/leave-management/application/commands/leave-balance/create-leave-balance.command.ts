/**
 * Command for creating a leave balance.
 * The use case derives amounts from the policy (earned = annual_entitlement, rest = 0) and sets status OPEN.
 */
export interface CreateLeaveBalanceCommand {
  /** Employee who receives the balance. */
  employee_id: number;
  /** Policy that defines the leave type and entitlement (earned days). */
  policy_id: number;
  /** Leave year (e.g. "2025"). */
  year: string;
  /** Optional notes. */
  remarks?: string;
}
