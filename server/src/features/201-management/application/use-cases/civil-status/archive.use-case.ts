import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { CivilStatusBusinessException } from '@/features/201-management/domain/exceptions';
import { CivilStatusRepository } from '@/features/201-management/domain/repositories';
import {
  CIVIL_STATUS_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveCivilStatusUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.CIVIL_STATUS)
    private readonly civilStatusRepository: CivilStatusRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      CIVIL_STATUS_ACTIONS.ARCHIVE,
      async (manager) => {
        const civil_status = await this.civilStatusRepository.findById(
          id,
          manager,
        );
        if (!civil_status) {
          throw new CivilStatusBusinessException(
            `Civil status with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        civil_status.archive(requestInfo?.user_name || '');

        const success = await this.civilStatusRepository.update(
          id,
          civil_status,
          manager,
        );
        if (!success) {
          throw new CivilStatusBusinessException(
            'Civil status archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: CIVIL_STATUS_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.CIVIL_STATUSES,
          details: JSON.stringify({
            id,
            desc1: civil_status.desc1,
            explanation: `Civil status with ID : ${id} archived by USER : ${
              requestInfo?.user_name || ''
            }`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(civil_status.deleted_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
