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
import type { GenerateBalancesForYearEntry } from '../../commands/leave-balance/generate-for-year.command';
import { RequestInfo } from '@/core/utils/request-info.util';
import { toNumber, toDate } from '@/core/utils/coercion.util';
import {
  parseYearStart,
  getCompletedMonthsBetween,
} from '@/core/utils/date.util';
import { LeaveBalanceBulkCreateService } from '@/features/leave-management/application/services/leave-balance';

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
  ) { }

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

        if (policies.length === 0) {
          throw new LeaveBalanceBusinessException(
            'No active leave policies found',
          );
        }

        const yearStart = this.parseYearStartOrThrow(year);
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
              annual_entitlement: entitlement,
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
    return (
      [first, last].filter(Boolean).join(' ') || `Employee #${employee.id}`
    );
  }

  private parseYearStartOrThrow(year: string): Date {
    try {
      return parseYearStart(year, { minYear: 1900, maxYear: 2100 });
    } catch {
      throw new LeaveBalanceBusinessException(
        'Year must be a valid year (e.g. 2025)',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }

  private checkEmployeeEligibleForPolicy(
    employee: EmployeeEligibilityInfo,
    policy: LeavePolicy,
    asOfDate: Date,
  ): { eligible: boolean; reason?: string } {
    const allowedEmploymentTypes = policy.allowed_employment_types ?? [];
    if (allowedEmploymentTypes.length > 0) {
      const typeMatch = allowedEmploymentTypes.some(
        (t) =>
          String(t).trim().toLowerCase() ===
          String(employee.employment_type ?? '')
            .trim()
            .toLowerCase(),
      );
      if (!typeMatch) {
        return {
          eligible: false,
          reason: `Employment type "${employee.employment_type ?? 'N/A'}" is not in policy's allowed types (${allowedEmploymentTypes.join(', ')})`,
        };
      }
    }

    const allowedEmployeeStatuses = policy.allowed_employee_statuses ?? [];
    if (allowedEmployeeStatuses.length > 0) {
      const statusMatch = allowedEmployeeStatuses.some(
        (s) =>
          String(s).trim().toLowerCase() ===
          String(employee.employment_status ?? '')
            .trim()
            .toLowerCase(),
      );
      if (!statusMatch) {
        return {
          eligible: false,
          reason: `Employment status "${employee.employment_status ?? 'N/A'}" is not in policy's allowed statuses (${allowedEmployeeStatuses.join(', ')})`,
        };
      }
    }

    const minimumServiceMonths = toNumber(policy.minimum_service_months);
    if (minimumServiceMonths > 0 && employee.hire_date != null) {
      const hireDate = toDate(employee.hire_date);
      if (!hireDate) {
        return {
          eligible: false,
          reason: 'Invalid hire date; cannot verify minimum service months',
        };
      }
      const tenureMonths = getCompletedMonthsBetween(hireDate, asOfDate);
      if (tenureMonths < minimumServiceMonths) {
        return {
          eligible: false,
          reason: `Tenure (${tenureMonths} months) is less than policy minimum (${minimumServiceMonths} months)`,
        };
      }
    }

    return { eligible: true };
  }
}
