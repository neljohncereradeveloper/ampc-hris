/**
 * Command for updating a leave policy (only when DRAFT or not yet active).
 */
export interface UpdateLeavePolicyCommand {
  /** New annual entitlement. */
  annual_entitlement: number;
  /** New carry limit. */
  carry_limit: number;
  /** New encash limit. */
  encash_limit: number;
  /** New carried over years. */
  carried_over_years: number;

  /** New minimum service months for eligibility (optional). */
  minimum_service_months?: number;
  /** New allowed employment types (optional). */
  allowed_employment_types?: string[];
  /** New allowed employment statuses (optional). */
  allowed_employee_statuses?: string[];
  /** New excluded weekdays (optional). */
  excluded_weekdays?: number[];
  /** New effective date (optional). */
  effective_date?: Date;
  /** New expiry date (optional). */
  expiry_date?: Date;
  /** Optional notes. (optional) */
  remarks?: string;
}
