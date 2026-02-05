import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { CivilStatusBusinessException } from '@/features/201-management/domain/exceptions';
import { CivilStatus } from '@/features/201-management/domain/models';
import { CivilStatusRepository } from '@/features/201-management/domain/repositories';
import {
  CIVIL_STATUS_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { UpdateCivilStatusCommand } from '../../commands/civil-status/update-civil-status.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateCivilStatusUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.CIVIL_STATUS)
    private readonly civilStatusRepository: CivilStatusRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    id: number,
    command: UpdateCivilStatusCommand,
    requestInfo?: RequestInfo,
  ): Promise<CivilStatus | null> {
    return this.transactionHelper.executeTransaction(
      CIVIL_STATUS_ACTIONS.UPDATE,
      async (manager) => {
        const civil_status = await this.civilStatusRepository.findById(
          id,
          manager,
        );
        if (!civil_status) {
          throw new CivilStatusBusinessException(
            'Civil status not found',
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

        const before_state = extractEntityState(civil_status, tracking_config);

        civil_status.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name || null,
        });

        const success = await this.civilStatusRepository.update(
          id,
          civil_status,
          manager,
        );
        if (!success) {
          throw new CivilStatusBusinessException(
            'Civil status update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.civilStatusRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: CIVIL_STATUS_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.CIVIL_STATUSES,
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
