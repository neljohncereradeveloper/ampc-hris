import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { DepartmentBusinessException } from '@/features/shared-domain/domain/exceptions';
import { DepartmentRepository } from '@/features/shared-domain/domain/repositories';
import {
  DEPARTMENT_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';

@Injectable()
export class RestoreDepartmentUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.DEPARTMENT)
    private readonly departmentRepository: DepartmentRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      DEPARTMENT_ACTIONS.RESTORE,
      async (manager) => {
        const department = await this.departmentRepository.findById(
          id,
          manager,
        );
        if (!department) {
          throw new DepartmentBusinessException(
            `Department with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        department.restore();

        const success = await this.departmentRepository.update(
          id,
          department,
          manager,
        );
        if (!success) {
          throw new DepartmentBusinessException(
            'Department restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: DEPARTMENT_ACTIONS.RESTORE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.DEPARTMENTS,
          details: JSON.stringify({
            id,
            desc1: department.desc1,
            explanation: `Department with ID : ${id} restored by USER : ${requestInfo?.user_name || ''}`,
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
