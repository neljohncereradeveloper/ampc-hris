import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EmployeeBusinessException } from '@/features/shared-domain/domain/exceptions';
import { EmployeeRepository } from '@/features/shared-domain/domain/repositories';
import {
  EMPLOYEE_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';

@Injectable()
export class RestoreEmployeeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.RESTORE,
      async (manager) => {
        const employee = await this.employeeRepository.findById(id, manager);
        if (!employee) {
          throw new EmployeeBusinessException(
            `Employee with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        employee.restore();

        const success = await this.employeeRepository.update(
          id,
          employee,
          manager,
        );
        if (!success) {
          throw new EmployeeBusinessException(
            'Employee restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EMPLOYEE_ACTIONS.RESTORE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES,
          details: JSON.stringify({
            id,
            id_number: employee.id_number,
            first_name: employee.first_name,
            last_name: employee.last_name,
            explanation: `Employee with ID : ${id} restored by USER : ${requestInfo?.user_name || ''}`,
            restored_by: requestInfo?.user_name || '',
            restored_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
