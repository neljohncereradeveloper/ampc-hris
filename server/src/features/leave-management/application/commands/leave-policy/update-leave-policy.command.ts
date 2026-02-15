/**
 * Command for updating a leave policy (only when DRAFT or not yet active).
 */
export interface UpdateLeavePolicyCommand {
  /** New annual entitlement (optional). */
  annual_entitlement?: number;
  /** New carry limit (optional). */
  carry_limit?: number;
  /** New encash limit (optional). */
  encash_limit?: number;
  /** New carried over years (optional). */
  carried_over_years?: number;
  /** New effective date (optional). */
  effective_date?: Date;
  /** New expiry date (optional). */
  expiry_date?: Date;
  /** New status (optional). */
  status?: string;
  /** Optional notes. */
  remarks?: string;
  /** New minimum service months for eligibility (optional). */
  minimum_service_months?: number;
  /** New allowed employment types (optional). */
  allowed_employment_types?: string[];
  /** New allowed employment statuses (optional). */
  allowed_employee_statuses?: string[];
  /** New excluded weekdays (optional). */
  excluded_weekdays?: number[];
}
