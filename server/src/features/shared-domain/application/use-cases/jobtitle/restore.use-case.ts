import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { JobtitleBusinessException } from '@/features/shared-domain/domain/exceptions';
import { JobtitleRepository } from '@/features/shared-domain/domain/repositories';
import {
  JOBTITLE_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';

@Injectable()
export class RestoreJobtitleUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.JOBTITLE)
    private readonly jobtitleRepository: JobtitleRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      JOBTITLE_ACTIONS.RESTORE,
      async (manager) => {
        const jobtitle = await this.jobtitleRepository.findById(id, manager);
        if (!jobtitle) {
          throw new JobtitleBusinessException(
            `Jobtitle with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        jobtitle.restore();

        const success = await this.jobtitleRepository.update(
          id,
          jobtitle,
          manager,
        );
        if (!success) {
          throw new JobtitleBusinessException(
            'Jobtitle restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: JOBTITLE_ACTIONS.RESTORE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.JOBTITLES,
          details: JSON.stringify({
            id,
            desc1: jobtitle.desc1,
            explanation: `Jobtitle with ID : ${id} restored by USER : ${requestInfo?.user_name || ''}`,
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
