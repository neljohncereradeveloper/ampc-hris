import { Inject, Injectable } from '@nestjs/common';
import {
  CONSTANTS_REPOSITORY_TOKENS,
} from '@shared/constants';
import { EmployeeRepository } from '@core/domain/repositories';
import { TransactionPort } from '@core/ports';
import { EMPLOYEE_ACTIONS } from '@core/domain/constants';
import { NotFoundException } from '@core/exceptions/shared';
import { getPHDateTime } from '@shared/utils';

export interface RetentionComplianceResponse {
  employee_id: number;
  id_number?: string;
  first_name: string;
  last_name: string;
  last_entry_date?: Date;
  retention_expiry_date?: Date;
  retention_period_expired: boolean; // True if retention period has expired (for reporting only)
  days_remaining?: number;
  days_expired?: number;
}

@Injectable()
export class CheckRetentionComplianceUseCase {
  constructor(
    @Inject(CONSTANTS_REPOSITORY_TOKENS.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(employee_id: number): Promise<RetentionComplianceResponse> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.FIND_BY_ID,
      async (manager) => {
        const employee = await this.employeeRepository.findById(employee_id, manager);
        
        if (!employee) {
          throw new NotFoundException('Employee not found');
        }

        const today = getPHDateTime();
        const retention_period_expired = employee.canBeArchived(); // True if retention period has expired
        
        let days_remaining: number | undefined;
        let days_expired: number | undefined;

        if (employee.retention_expiry_date) {
          const diff_ms = employee.retention_expiry_date.getTime() - today.getTime();
          const diff_days = Math.ceil(diff_ms / (1000 * 60 * 60 * 24));
          
          if (diff_days > 0) {
            days_remaining = diff_days;
          } else {
            days_expired = Math.abs(diff_days);
          }
        }

        return {
          employee_id: employee.id!,
          id_number: employee.id_number,
          first_name: employee.first_name,
          last_name: employee.last_name,
          last_entry_date: employee.last_entry_date,
          retention_expiry_date: employee.retention_expiry_date,
          retention_period_expired, // For compliance reporting only - archiving is always allowed
          days_remaining,
          days_expired,
        };
      },
    );
  }
}

