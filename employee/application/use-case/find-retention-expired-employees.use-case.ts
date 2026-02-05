import { Inject, Injectable } from '@nestjs/common';
import {
  CONSTANTS_REPOSITORY_TOKENS,
} from '@shared/constants';
import { EmployeeRepository } from '@core/domain/repositories';
import { TransactionPort } from '@core/ports';
import { EMPLOYEE_ACTIONS } from '@core/domain/constants';
import { getPHDateTime } from '@shared/utils';
import { Employee } from '@core/domain/models/employee.model';

export interface RetentionExpiredEmployeesResponse {
  total: number;
  employees: Array<{
    id: number;
    id_number?: string;
    first_name: string;
    last_name: string;
    last_entry_date?: Date;
    retention_expiry_date?: Date;
    days_expired: number;
  }>;
}

@Injectable()
export class FindRetentionExpiredEmployeesUseCase {
  constructor(
    @Inject(CONSTANTS_REPOSITORY_TOKENS.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(): Promise<RetentionExpiredEmployeesResponse> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        // Get all non-archived employees using paginated list with large limit
        // We use a large limit to get all employees, then filter in memory
        const result = await this.employeeRepository.findPaginatedList(
          '', // no search term
          1, // page 1
          10000, // large limit to get all employees
          false, // not archived
          manager,
        );
        
        const today = getPHDateTime();
        // Filter employees whose retention period has expired (for compliance reporting)
        // Note: Archiving (soft delete) is always allowed regardless of retention status
        const retention_expired_employees = result.data
          .filter((employee) => {
            // Check if retention period has expired (for reporting purposes)
            return employee.canBeArchived();
          })
          .map((employee) => {
            let days_expired = 0;
            if (employee.retention_expiry_date) {
              const diff_ms = today.getTime() - employee.retention_expiry_date.getTime();
              days_expired = Math.ceil(diff_ms / (1000 * 60 * 60 * 24));
            }

            return {
              id: employee.id!,
              id_number: employee.id_number,
              first_name: employee.first_name,
              last_name: employee.last_name,
              last_entry_date: employee.last_entry_date,
              retention_expiry_date: employee.retention_expiry_date,
              days_expired,
            };
          })
          .sort((a, b) => {
            // Sort by days_expired descending (most expired first)
            return (b.days_expired || 0) - (a.days_expired || 0);
          });

        return {
          total: retention_expired_employees.length,
          employees: retention_expired_employees,
        };
      },
    );
  }
}

