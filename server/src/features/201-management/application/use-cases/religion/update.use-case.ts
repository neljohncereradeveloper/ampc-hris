import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { ReligionBusinessException } from '@/features/201-management/domain/exceptions';
import { Religion } from '@/features/201-management/domain/models';
import { ReligionRepository } from '@/features/201-management/domain/repositories';
import {
  RELIGION_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { UpdateReligionCommand } from '../../commands/religion/update-religion.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateReligionUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.RELIGION)
    private readonly religionRepository: ReligionRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    id: number,
    command: UpdateReligionCommand,
    requestInfo?: RequestInfo,
  ): Promise<Religion | null> {
    return this.transactionHelper.executeTransaction(
      RELIGION_ACTIONS.UPDATE,
      async (manager) => {
        const religion = await this.religionRepository.findById(id, manager);
        if (!religion) {
          throw new ReligionBusinessException(
            'Religion not found',
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

        const before_state = extractEntityState(religion, tracking_config);

        religion.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name || null,
        });

        const success = await this.religionRepository.update(
          id,
          religion,
          manager,
        );
        if (!success) {
          throw new ReligionBusinessException(
            'Religion update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.religionRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: RELIGION_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.RELIGIONS,
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
