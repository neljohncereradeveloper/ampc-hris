import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveYearConfigurationBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeaveYearConfiguration } from '@/features/leave-management/domain/models';
import { LeaveYearConfigurationRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_YEAR_CONFIGURATION_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { UpdateLeaveYearConfigurationCommand } from '../../commands/leave-year-configuration/update-leave-year-configuration.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateLeaveYearConfigurationUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_YEAR_CONFIGURATION)
    private readonly repo: LeaveYearConfigurationRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateLeaveYearConfigurationCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeaveYearConfiguration | null> {
    return this.transactionHelper.executeTransaction(
      LEAVE_YEAR_CONFIGURATION_ACTIONS.UPDATE,
      async (manager) => {
        const entity = await this.repo.findById(id, manager);
        if (!entity) {
          throw new LeaveYearConfigurationBusinessException(
            'Leave year configuration not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'year' },
          {
            field: 'updated_at',
            transform: (val: Date) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];
        const before_state = extractEntityState(entity, tracking_config);

        entity.update({
          cutoff_start_date: command.cutoff_start_date,
          cutoff_end_date: command.cutoff_end_date,
          year: command.year,
          remarks: command.remarks,
          updated_by: requestInfo?.user_name ?? null,
        });
        entity.updated_at = getPHDateTime();

        const success = await this.repo.update(id, entity, manager);
        if (!success) {
          throw new LeaveYearConfigurationBusinessException(
            'Leave year configuration update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated = await this.repo.findById(id, manager);
        const after_state = extractEntityState(updated, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: LEAVE_YEAR_CONFIGURATION_ACTIONS.UPDATE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS,
          details: JSON.stringify({
            id: updated?.id,
            changed_fields,
            updated_by: requestInfo?.user_name ?? '',
            updated_at: getPHDateTime(updated?.updated_at ?? new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated;
      },
    );
  }
}
