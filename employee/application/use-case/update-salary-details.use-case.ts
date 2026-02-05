import { TransactionPort } from '@core/ports';
import { Employee } from '@core/domain/models/employee.model';
import {
  EmployeeRepository,
  ActivityLogRepository,
} from '@core/domain/repositories';
import { Inject, Injectable } from '@nestjs/common';
import {
  CONSTANTS_DATABASE_MODELS,
  CONSTANTS_REPOSITORY_TOKENS,
} from '@shared/constants';
import { UpdateSalaryDetailsCommand } from '../../commands/employee/update-salary-details.command';
import { RequestInfo } from '@shared/interfaces';
import {
  SomethinWentWrongException,
  NotFoundException,
} from '@core/exceptions/shared';
import { ActivityLog } from '@core/domain/models';
import { EMPLOYEE_ACTIONS } from '@core/domain/constants';
import { getPHDateTime } from '@shared/utils';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@shared/utils/change-tracking.util';

@Injectable()
export class UpdateSalaryDetailsUseCase {
  constructor(
    @Inject(CONSTANTS_REPOSITORY_TOKENS.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    dto: UpdateSalaryDetailsCommand,
    requestInfo?: RequestInfo,
  ): Promise<Employee | null> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.UPDATE_SALARY_DETAILS,
      async (manager) => {
        // Validate employee existence
        const employee = await this.employeeRepository.findById(id, manager);
        if (!employee) {
          throw new NotFoundException('Employee not found');
        }

        // Define fields to track for change logging
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

        // Capture before state for logging
        const before_state = extractEntityState(employee, tracking_config);

        // Use domain model method to update (encapsulates business logic and validation)
        employee.updateSalaryDetails({
          annual_salary: dto.annual_salary,
          monthly_salary: dto.monthly_salary,
          daily_rate: dto.daily_rate,
          hourly_rate: dto.hourly_rate,
          pay_type: dto.pay_type,
        });

        // Update the employee in the database
        const success = await this.employeeRepository.update(
          id,
          employee,
          manager,
        );
        if (!success) {
          throw new SomethinWentWrongException('Employee update failed');
        }

        // Retrieve the updated employee
        const updated_result = await this.employeeRepository.findById(
          id,
          manager,
        );

        // Capture after state for logging
        const after_state = extractEntityState(updated_result, tracking_config);

        // Get only the changed fields with old and new states
        const changed_fields = getChangedFields(before_state, after_state);

        // Log the update with only changed fields (old state and new state)
        const log = ActivityLog.create({
          action: EMPLOYEE_ACTIONS.UPDATE_SALARY_DETAILS,
          entity: CONSTANTS_DATABASE_MODELS.EMPLOYEES,
          details: JSON.stringify({
            employee_id: updated_result?.id,
            employee_name: `${updated_result?.first_name} ${updated_result?.last_name}`,
            id_number: updated_result?.id_number,
            changed_fields: changed_fields,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(updated_result?.updated_at || new Date()),
          }),
          employee_id: updated_result?.id,
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_result!;
      },
    );
  }
}
