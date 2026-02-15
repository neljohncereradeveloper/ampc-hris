/**
 * Command for creating a leave policy (typically as DRAFT).
 */
export interface CreateLeavePolicyCommand {
  /** Leave type (e.g. VL, SL) this policy applies to. */
  leave_type_id: number;
  /** Number of leave days granted per year. */
  annual_entitlement: number;
  /** Maximum days that can be carried over to the next year. */
  carry_limit: number;
  /** Maximum days that can be encashed per year. */
  encash_limit: number;
  /** Number of years from which unused days can be carried over. */
  carried_over_years: number;
  /** Date when this policy becomes effective (optional). */
  effective_date?: Date;
  /** Date when this policy stops being in effect (optional). */
  expiry_date?: Date;
  /** Initial status (e.g. "draft"). */
  status: string;
  /** Optional notes. */
  remarks?: string;
  /** Minimum months of service required for eligibility. */
  minimum_service_months?: number;
  /** Employment types allowed (e.g. ["regular", "probationary"]). */
  allowed_employment_types?: string[];
  /** Employment statuses allowed (e.g. ["active"]). */
  allowed_employee_statuses?: string[];
  /** Weekday numbers to exclude from leave days (0=Sun, ..., 6=Sat). */
  excluded_weekdays?: number[];
}
