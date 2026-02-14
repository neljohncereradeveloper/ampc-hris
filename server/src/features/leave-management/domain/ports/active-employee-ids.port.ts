/**
 * Filters for which employees to include (e.g. for year-start balance generation).
 * Employment type/status names (e.g. ["regular", "probationary"], ["active", "on-leave"]).
 */
export interface ActiveEmployeeIdsFilters {
  employment_types?: string[];
  employment_statuses?: string[];
}

/**
 * Minimal employee data needed to check policy eligibility (allowed_employment_types,
 * allowed_employee_statuses, minimum_service_months) when generating annual balances.
 */
export interface EmployeeEligibilityInfo {
  id: number;
  first_name: string;
  last_name: string;
  employment_type: string;
  employment_status: string;
  hire_date: Date;
}

/**
 * Port to resolve employees eligible for leave (e.g. for year-start balance generation).
 * Implemented by an adapter that uses the employee repository or HR service.
 * Returns eligibility info so callers can apply policy-level rules (allowed_employment_types,
 * allowed_employee_statuses, minimum_service_months).
 */
export interface ActiveEmployeeIdsPort<Context = unknown> {
  getEmployeesEligibleForLeave(
    context: Context,
    filters: ActiveEmployeeIdsFilters,
  ): Promise<EmployeeEligibilityInfo[]>;
}
