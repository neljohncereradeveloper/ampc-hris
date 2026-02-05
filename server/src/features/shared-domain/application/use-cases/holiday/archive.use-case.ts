import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HolidayBusinessException } from '@/features/shared-domain/domain/exceptions';
import { HolidayRepository } from '@/features/shared-domain/domain/repositories';
import {
  HOLIDAY_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveHolidayUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.HOLIDAY)
    private readonly holidayRepository: HolidayRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      HOLIDAY_ACTIONS.ARCHIVE,
      async (manager) => {
        const holiday = await this.holidayRepository.findById(id, manager);
        if (!holiday) {
          throw new HolidayBusinessException(
            `Holiday with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        holiday.archive(requestInfo?.user_name || '');

        const success = await this.holidayRepository.update(
          id,
          holiday,
          manager,
        );
        if (!success) {
          throw new HolidayBusinessException(
            'Holiday archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: HOLIDAY_ACTIONS.ARCHIVE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.HOLIDAYS,
          details: JSON.stringify({
            id,
            name: holiday.name,
            explanation: `Holiday with ID : ${id} archived by USER : ${requestInfo?.user_name || ''}`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(holiday.deleted_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
