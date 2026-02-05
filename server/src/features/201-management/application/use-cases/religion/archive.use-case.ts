import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { ReligionBusinessException } from '@/features/201-management/domain/exceptions';
import { ReligionRepository } from '@/features/201-management/domain/repositories';
import {
  RELIGION_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveReligionUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.RELIGION)
    private readonly religionRepository: ReligionRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      RELIGION_ACTIONS.ARCHIVE,
      async (manager) => {
        const religion = await this.religionRepository.findById(id, manager);
        if (!religion) {
          throw new ReligionBusinessException(
            `Religion with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        religion.archive(requestInfo?.user_name || '');

        const success = await this.religionRepository.update(
          id,
          religion,
          manager,
        );
        if (!success) {
          throw new ReligionBusinessException(
            'Religion archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: RELIGION_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.RELIGIONS,
          details: JSON.stringify({
            id,
            desc1: religion.desc1,
            explanation: `Religion with ID : ${id} archived by USER : ${requestInfo?.user_name || ''}`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(religion.deleted_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
