import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveBalanceBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeavePolicyRepository } from '@/features/leave-management/domain/repositories';
import {
  ActiveEmployeeIdsPort,
  ActiveEmployeeIdsFilters,
  EmployeeEligibilityInfo,
} from '@/features/leave-management/domain/ports';
import { LeavePolicy } from '@/features/leave-management/domain/models';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_BALANCE_ACTIONS,
} from '@/features/leave-management/domain/constants';
import type { GenerateBalancesForYearEntry } from '../../commands/leave-balance/generate-balances-for-year.command';
import { RequestInfo } from '@/core/utils/request-info.util';
import { LeaveBalanceBulkCreateService } from '@/features/leave-management/application/services/leave-balance';

/** Coerce unknown to number; use default if not a finite number. */
function toNumber(value: unknown, defaultVal = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : defaultVal;
}

/** Coerce to Date; return null if invalid. */
function toDate(value: unknown): Date | null {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const d = new Date(value as string | number);
  return isNaN(d.getTime()) ? null : d;
}

/** One record for the response when an employee is skipped for a leave type (ineligible). */
export interface SkippedEmployeeItem {
  employee_id: number;
  employee_name: string;
  leave_type: string;
  reason: string;
  details: string;
}

export interface GenerateBalancesForAllEmployeesResult {
  created_count: number;
  skipped_count: number;
  skipped_employees: SkippedEmployeeItem[];
}

/**
 * Generates leave balances for the start of a year for employees eligible for leave.
 * Uses findEmployeesEligibleForLeave and applies per-policy rules: allowed_employment_types,
 * allowed_employee_statuses, and minimum_service_months. Idempotent: existing balances are skipped.
 * Returns created/skipped counts and a list of skipped employees with ineligibility details.
 */
@Injectable()
export class GenerateBalancesForAllEmployeesUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.ACTIVE_EMPLOYEE_IDS_PORT)
    private readonly activeEmployeeIdsPort: ActiveEmployeeIdsPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY)
    private readonly policyRepo: LeavePolicyRepository,
    private readonly bulkCreateService: LeaveBalanceBulkCreateService,
  ) {}

  async execute(
    year: string,
    filters: ActiveEmployeeIdsFilters,
    requestInfo?: RequestInfo,
  ): Promise<GenerateBalancesForAllEmployeesResult> {
    if (!year?.trim()) {
      throw new LeaveBalanceBusinessException(
        'Year is required',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (
      !filters?.employment_types?.length ||
      !filters?.employment_statuses?.length
    ) {
      throw new LeaveBalanceBusinessException(
        'employment_types and employment_statuses are required and must be non-empty',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    return this.transactionHelper.executeTransaction(
      LEAVE_BALANCE_ACTIONS.GENERATE_BALANCES_FOR_YEAR,
      async (manager) => {
        const employees =
          await this.activeEmployeeIdsPort.getEmployeesEligibleForLeave(
            manager,
            filters,
          );
        const policies = await this.policyRepo.retrieveActivePolicies(manager);

        const yearStart = this.parseYearStart(year);
        const entries: GenerateBalancesForYearEntry[] = [];
        const skipped_employees: SkippedEmployeeItem[] = [];

        for (const employee of employees) {
          const employee_id = toNumber(employee.id, -1);
          if (employee_id < 0) continue;

          for (const policy of policies) {
            const policy_id = toNumber(policy.id, -1);
            if (policy_id < 0) continue;

            const eligibility_check = this.checkEmployeeEligibleForPolicy(
              employee,
              policy,
              yearStart,
            );
            if (!eligibility_check.eligible) {
              skipped_employees.push({
                employee_id,
                employee_name: this.getEmployeeName(employee),
                leave_type:
                  typeof policy.leave_type === 'string'
                    ? policy.leave_type
                    : 'Unknown Leave Type',
                reason: 'ineligible',
                details:
                  eligibility_check.reason ??
                  'Employee is not eligible for this leave type',
              });
              continue;
            }
            const entitlement = toNumber(policy.annual_entitlement);
            const leave_type_id = toNumber(policy.leave_type_id, -1);
            if (leave_type_id < 0) continue;

            entries.push({
              employee_id,
              leave_type_id,
              policy_id,
              earned: entitlement,
              remaining: entitlement,
            });
          }
        }

        const { created_count, skipped_count } =
          await this.bulkCreateService.execute(
            year,
            entries,
            manager,
            requestInfo,
          );

        return {
          created_count,
          skipped_count,
          skipped_employees,
        };
      },
    );
  }

  private getEmployeeName(employee: EmployeeEligibilityInfo): string {
    const first = (employee.first_name ?? '').trim();
    const last = (employee.last_name ?? '').trim();
    return [first, last].filter(Boolean).join(' ') || `Employee #${employee.id}`;
  }

  private parseYearStart(year: string): Date {
    const yearNum = toNumber(year, NaN);
    const y = Number.isFinite(yearNum) ? Math.floor(yearNum) : parseInt(String(year).trim(), 10);
    if (!Number.isInteger(y) || y < 1900 || y > 2100) {
      throw new LeaveBalanceBusinessException(
        'Year must be a valid year (e.g. 2025)',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    const parsed = new Date(Date.UTC(y, 0, 1));
    if (isNaN(parsed.getTime())) {
      throw new LeaveBalanceBusinessException(
        'Year must be a valid year (e.g. 2025)',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return parsed;
  }

  private checkEmployeeEligibleForPolicy(
    employee: EmployeeEligibilityInfo,
    policy: LeavePolicy,
    asOfDate: Date,
  ): { eligible: boolean; reason?: string } {
    const allowedTypes = policy.allowed_employment_types ?? [];
    if (allowedTypes.length > 0) {
      const typeMatch = allowedTypes.some(
        (t) =>
          String(t).trim().toLowerCase() ===
          String(employee.employment_type ?? '').trim().toLowerCase(),
      );
      if (!typeMatch) {
        return {
          eligible: false,
          reason: `Employment type "${employee.employment_type ?? 'N/A'}" is not in policy's allowed types (${allowedTypes.join(', ')})`,
        };
      }
    }

    const allowedStatuses = policy.allowed_employee_statuses ?? [];
    if (allowedStatuses.length > 0) {
      const statusMatch = allowedStatuses.some(
        (s) =>
          String(s).trim().toLowerCase() ===
          String(employee.employment_status ?? '').trim().toLowerCase(),
      );
      if (!statusMatch) {
        return {
          eligible: false,
          reason: `Employment status "${employee.employment_status ?? 'N/A'}" is not in policy's allowed statuses (${allowedStatuses.join(', ')})`,
        };
      }
    }

    const minMonths = toNumber(policy.minimum_service_months);
    if (minMonths > 0 && employee.hire_date != null) {
      const hireDate = toDate(employee.hire_date);
      if (!hireDate) {
        return {
          eligible: false,
          reason: 'Invalid hire date; cannot verify minimum service months',
        };
      }
      const tenureMonths = this.getCompletedMonthsBetween(hireDate, asOfDate);
      if (tenureMonths < minMonths) {
        return {
          eligible: false,
          reason: `Tenure (${tenureMonths} months) is less than policy minimum (${minMonths} months)`,
        };
      }
    }

    return { eligible: true };
  }

  /** Completed full months between two dates (inclusive of start month, exclusive of end month semantics: months of service). */
  private getCompletedMonthsBetween(from: Date, to: Date): number {
    const fromTime = from.getTime();
    const toTime = to.getTime();
    if (isNaN(fromTime) || isNaN(toTime) || toTime < fromTime) return 0;
    const years = to.getUTCFullYear() - from.getUTCFullYear();
    const months = to.getUTCMonth() - from.getUTCMonth();
    const totalMonths = years * 12 + months;
    return Math.max(0, Math.floor(totalMonths));
  }
}
