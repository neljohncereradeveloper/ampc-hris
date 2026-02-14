/**
 * Command for creating a leave policy.
 */
export interface CreateLeavePolicyCommand {
  leave_type_id: number;
  annual_entitlement: number;
  carry_limit: number;
  encash_limit: number;
  carried_over_years: number;
  effective_date?: Date;
  expiry_date?: Date;
  status: string;
  remarks?: string;
  minimum_service_months?: number;
  allowed_employment_types?: string[];
  allowed_employee_statuses?: string[];
  excluded_weekdays?: number[];
}
