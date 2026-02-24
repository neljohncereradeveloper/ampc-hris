import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { JobtitleBusinessException } from '@/features/shared-domain/domain/exceptions';
import { Jobtitle } from '@/features/shared-domain/domain/models';
import { JobtitleRepository } from '@/features/shared-domain/domain/repositories';
import {
  JOBTITLE_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { CreateJobtitleCommand } from '../../commands/jobtitle/create-jobtitle.command';

@Injectable()
export class CreateJobtitleUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.JOBTITLE)
    private readonly jobtitleRepository: JobtitleRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateJobtitleCommand,
    requestInfo?: RequestInfo,
  ): Promise<Jobtitle> {
    return this.transactionHelper.executeTransaction(
      JOBTITLE_ACTIONS.CREATE,
      async (manager) => {
        const new_jobtitle = Jobtitle.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || '',
        });

        const created_jobtitle = await this.jobtitleRepository.create(
          new_jobtitle,
          manager,
        );

        if (!created_jobtitle) {
          throw new JobtitleBusinessException(
            'Jobtitle creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: JOBTITLE_ACTIONS.CREATE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.JOBTITLES,
          details: JSON.stringify({
            id: created_jobtitle.id,
            desc1: created_jobtitle.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_jobtitle.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_jobtitle;
      },
    );
  }
}
