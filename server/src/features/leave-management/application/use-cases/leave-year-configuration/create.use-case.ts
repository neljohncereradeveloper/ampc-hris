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
import { CreateLeaveYearConfigurationCommand } from '../../commands/leave-year-configuration/create-leave-year-configuration.command';

@Injectable()
export class CreateLeaveYearConfigurationUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_YEAR_CONFIGURATION)
    private readonly repo: LeaveYearConfigurationRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateLeaveYearConfigurationCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeaveYearConfiguration> {
    return this.transactionHelper.executeTransaction(
      LEAVE_YEAR_CONFIGURATION_ACTIONS.CREATE,
      async (manager) => {
        const entity = LeaveYearConfiguration.create({
          cutoff_start_date: command.cutoff_start_date,
          cutoff_end_date: command.cutoff_end_date,
          year: command.year,
          remarks: command.remarks,
          created_by: requestInfo?.user_name ?? null,
        });

        const created = await this.repo.create(entity, manager);
        if (!created) {
          throw new LeaveYearConfigurationBusinessException(
            'Leave year configuration creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_YEAR_CONFIGURATION_ACTIONS.CREATE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS,
          details: JSON.stringify({
            id: created.id,
            year: created.year,
            created_by: requestInfo?.user_name ?? '',
            created_at: getPHDateTime(created.created_at),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created;
      },
    );
  }
}
