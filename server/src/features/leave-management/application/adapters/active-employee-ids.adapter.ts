import { Inject, Injectable } from '@nestjs/common';
import {
  ActiveEmployeeIdsPort,
  ActiveEmployeeIdsFilters,
  EmployeeEligibilityInfo,
} from '@/features/leave-management/domain/ports';
import { EmployeeRepository } from '@/features/shared-domain/domain/repositories';
import { SHARED_DOMAIN_TOKENS } from '@/features/shared-domain/domain/constants';

/**
 * Adapter that implements ActiveEmployeeIdsPort using the shared-domain EmployeeRepository.
 * Uses findEmployeesEligibleForLeave and returns eligibility info for policy-level checks.
 */
@Injectable()
export class ActiveEmployeeIdsAdapter implements ActiveEmployeeIdsPort {
  constructor(
    @Inject(SHARED_DOMAIN_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async getEmployeesEligibleForLeave(
    context: unknown,
    filters: ActiveEmployeeIdsFilters,
  ): Promise<EmployeeEligibilityInfo[]> {
    const employees =
      await this.employeeRepository.findEmployeesEligibleForLeave(
        filters.employment_types ?? [],
        filters.employment_statuses ?? [],
        context,
      );

    return employees
      .filter((e): e is typeof e & { id: number } => e.id != null)
      .map(
        (e): EmployeeEligibilityInfo => ({
          id: e.id as number,
          first_name: e.first_name ?? '',
          last_name: e.last_name ?? '',
          employment_type: e.employment_type ?? '',
          employment_status: e.employment_status ?? '',
          hire_date:
            e.hire_date instanceof Date
              ? e.hire_date
              : new Date((e.hire_date as unknown) as string),
        }),
      );
  }
}
