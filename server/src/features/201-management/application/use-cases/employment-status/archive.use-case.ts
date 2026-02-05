import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
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
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveEmploymentStatusUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EMPLOYMENT_STATUS)
    private readonly employmentStatusRepository: EmploymentStatusRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EMPLOYMENT_STATUS_ACTIONS.ARCHIVE,
      async (manager) => {
        const employment_status =
          await this.employmentStatusRepository.findById(id, manager);
        if (!employment_status) {
          throw new EmploymentStatusBusinessException(
            `Employment status with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        employment_status.archive(requestInfo?.user_name || '');

        const success = await this.employmentStatusRepository.update(
          id,
          employment_status,
          manager,
        );
        if (!success) {
          throw new EmploymentStatusBusinessException(
            'Employment status archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EMPLOYMENT_STATUS_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_STATUSES,
          details: JSON.stringify({
            id,
            desc1: employment_status.desc1,
            explanation: `Employment status with ID : ${id} archived by USER : ${requestInfo?.user_name || ''
              }`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(employment_status.deleted_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
