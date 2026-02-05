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
import { UpdateJobtitleCommand } from '../../commands/jobtitle/update-jobtitle.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateJobtitleUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.JOBTITLE)
    private readonly jobtitleRepository: JobtitleRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateJobtitleCommand,
    requestInfo?: RequestInfo,
  ): Promise<Jobtitle | null> {
    return this.transactionHelper.executeTransaction(
      JOBTITLE_ACTIONS.UPDATE,
      async (manager) => {
        const jobtitle = await this.jobtitleRepository.findById(id, manager);
        if (!jobtitle) {
          throw new JobtitleBusinessException(
            'Jobtitle not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'desc1' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(jobtitle, tracking_config);

        jobtitle.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name || null,
        });

        const success = await this.jobtitleRepository.update(
          id,
          jobtitle,
          manager,
        );
        if (!success) {
          throw new JobtitleBusinessException(
            'Jobtitle update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.jobtitleRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: JOBTITLE_ACTIONS.UPDATE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.JOBTITLES,
          details: JSON.stringify({
            id: updated_result?.id,
            changed_fields: changed_fields,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(updated_result?.updated_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_result;
      },
    );
  }
}
