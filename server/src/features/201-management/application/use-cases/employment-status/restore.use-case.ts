import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EmploymentStatusBusinessException } from '@/features/201-management/domain/exceptions';
import { EmploymentStatusRepository } from '@/features/201-management/domain/repositories';
import {
  EMPLOYMENT_STATUS_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class RestoreEmploymentStatusUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EMPLOYMENT_STATUS)
    private readonly employmentStatusRepository: EmploymentStatusRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EMPLOYMENT_STATUS_ACTIONS.RESTORE,
      async (manager) => {
        const employment_status =
          await this.employmentStatusRepository.findById(id, manager);
        if (!employment_status) {
          throw new EmploymentStatusBusinessException(
            `Employment status with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        employment_status.restore();

        const success = await this.employmentStatusRepository.update(
          id,
          employment_status,
          manager,
        );
        if (!success) {
          throw new EmploymentStatusBusinessException(
            'Employment status restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EMPLOYMENT_STATUS_ACTIONS.RESTORE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_STATUSES,
          details: JSON.stringify({
            id,
            desc1: employment_status.desc1,
            explanation: `Employment status with ID : ${id} restored by USER : ${
              requestInfo?.user_name || ''
            }`,
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
