import { Inject, Injectable } from '@nestjs/common';
import {
  CONSTANTS_DATABASE_MODELS,
  CONSTANTS_REPOSITORY_TOKENS,
} from '@shared/constants';
import {
  ActivityLogRepository,
  EmployeeRepository,
} from '@core/domain/repositories';
import { RequestInfo } from '@shared/interfaces';
import { ActivityLog } from '@core/domain/models';
import { getPHDateTime } from '@shared/utils';
import { TransactionPort } from '@core/ports';
import {
  NotFoundException,
  SomethinWentWrongException,
} from '@core/exceptions/shared';
import { EMPLOYEE_ACTIONS } from '@core/domain/constants';

@Injectable()
export class ArchiveEmployeeUseCase {
  constructor(
    @Inject(CONSTANTS_REPOSITORY_TOKENS.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.ARCHIVE,
      async (manager) => {
        // Validate employee existence
        const employee = await this.employeeRepository.findById(id, manager);
        if (!employee) {
          throw new NotFoundException('Employee not found');
        }

        // Use domain method to archive (soft delete)
        employee.archive(requestInfo?.user_name || '');

        // Soft delete the employee
        const success = await this.employeeRepository.update(
          id,
          employee,
          manager,
        );
        if (!success) {
          throw new SomethinWentWrongException('Employee archive failed');
        }

        // Log the archive
        const log = ActivityLog.create({
          action: EMPLOYEE_ACTIONS.ARCHIVE,
          entity: CONSTANTS_DATABASE_MODELS.EMPLOYEES,
          details: JSON.stringify({
            id,
            id_number: employee.id_number,
            first_name: employee.first_name,
            last_name: employee.last_name,
            explanation: `Employee with ID : ${id} archived by USER : ${requestInfo?.user_name || ''}`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(employee.deleted_at || new Date()),
          }),
          employee_id: id,
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
