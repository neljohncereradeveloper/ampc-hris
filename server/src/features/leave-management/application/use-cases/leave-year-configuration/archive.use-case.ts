import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveYearConfigurationBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeaveYearConfigurationRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_YEAR_CONFIGURATION_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveLeaveYearConfigurationUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_YEAR_CONFIGURATION)
    private readonly repo: LeaveYearConfigurationRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      LEAVE_YEAR_CONFIGURATION_ACTIONS.ARCHIVE,
      async (manager) => {
        const entity = await this.repo.findById(id, manager);
        if (!entity) {
          throw new LeaveYearConfigurationBusinessException(
            `Leave year configuration with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        entity.archive(requestInfo?.user_name ?? '');

        const success = await this.repo.update(id, entity, manager);
        if (!success) {
          throw new LeaveYearConfigurationBusinessException(
            'Leave year configuration archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_YEAR_CONFIGURATION_ACTIONS.ARCHIVE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS,
          details: JSON.stringify({
            id,
            year: entity.year,
            archived_by: requestInfo?.user_name ?? '',
            archived_at: getPHDateTime(entity.deleted_at ?? new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
