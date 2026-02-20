import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HolidayBusinessException } from '@/features/shared-domain/domain/exceptions';
import { Holiday } from '@/features/shared-domain/domain/models';
import { HolidayRepository } from '@/features/shared-domain/domain/repositories';
import {
  HOLIDAY_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { UpdateHolidayCommand } from '../../commands/holiday/update-holiday.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateHolidayUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.HOLIDAY)
    private readonly holidayRepository: HolidayRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    id: number,
    command: UpdateHolidayCommand,
    requestInfo?: RequestInfo,
  ): Promise<Holiday | null> {
    return this.transactionHelper.executeTransaction(
      HOLIDAY_ACTIONS.UPDATE,
      async (manager) => {
        const holiday = await this.holidayRepository.findById(id, manager);
        if (!holiday) {
          throw new HolidayBusinessException(
            'Holiday not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'name' },
          {
            field: 'date',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'type' },
          { field: 'description' },
          { field: 'is_recurring' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(holiday, tracking_config);

        holiday.update({
          name: command.name,
          date: command.date,
          type: command.type,
          description: command.description,
          is_recurring: command.is_recurring,
          updated_by: requestInfo?.user_name,
        });

        const success = await this.holidayRepository.update(
          id,
          holiday,
          manager,
        );
        if (!success) {
          throw new HolidayBusinessException(
            'Holiday update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.holidayRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: HOLIDAY_ACTIONS.UPDATE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.HOLIDAYS,
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
