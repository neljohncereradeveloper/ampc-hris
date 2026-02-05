import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EmployeeBusinessException } from '@/features/shared-domain/domain/exceptions';
import { Employee } from '@/features/shared-domain/domain/models';
import { EmployeeRepository } from '@/features/shared-domain/domain/repositories';
import {
  EMPLOYEE_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { UpdateSalaryDetailsCommand } from '../../commands/employee/update-salary-details.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateSalaryDetailsEmployeeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    employee_id: number,
    command: UpdateSalaryDetailsCommand,
    requestInfo?: RequestInfo,
  ): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.UPDATE_SALARY_DETAILS,
      async (manager) => {
        const employee = await this.employeeRepository.findById(
          employee_id,
          manager,
        );
        if (!employee) {
          throw new EmployeeBusinessException(
            'Employee not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'annual_salary' },
          { field: 'monthly_salary' },
          { field: 'daily_rate' },
          { field: 'hourly_rate' },
          { field: 'pay_type' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(employee, tracking_config);

        const salary_details: Partial<Employee> = {
          annual_salary: command.annual_salary,
          monthly_salary: command.monthly_salary,
          daily_rate: command.daily_rate,
          hourly_rate: command.hourly_rate,
          pay_type: command.pay_type,
          updated_by: requestInfo?.user_name || null,
        };

        const success = await this.employeeRepository.updateSalaryDetails(
          employee_id,
          salary_details,
          manager,
        );
        if (!success) {
          throw new EmployeeBusinessException(
            'Employee salary details update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.employeeRepository.findById(
          employee_id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: EMPLOYEE_ACTIONS.UPDATE_SALARY_DETAILS,
          entity: SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES,
          details: JSON.stringify({
            id: updated_result?.id,
            changed_fields: changed_fields,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(updated_result?.updated_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
