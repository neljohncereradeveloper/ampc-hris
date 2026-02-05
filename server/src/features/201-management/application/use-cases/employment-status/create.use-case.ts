import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EmploymentStatusBusinessException } from '@/features/201-management/domain/exceptions';
import { EmploymentStatus } from '@/features/201-management/domain/models';
import { EmploymentStatusRepository } from '@/features/201-management/domain/repositories';
import {
  EMPLOYMENT_STATUS_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { CreateEmploymentStatusCommand } from '../../commands/employment-status/create-employment-status.command';

@Injectable()
export class CreateEmploymentStatusUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EMPLOYMENT_STATUS)
    private readonly employmentStatusRepository: EmploymentStatusRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    command: CreateEmploymentStatusCommand,
    requestInfo?: RequestInfo,
  ): Promise<EmploymentStatus> {
    return this.transactionHelper.executeTransaction(
      EMPLOYMENT_STATUS_ACTIONS.CREATE,
      async (manager) => {
        const new_employment_status = EmploymentStatus.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        const created_employment_status =
          await this.employmentStatusRepository.create(
            new_employment_status,
            manager,
          );

        if (!created_employment_status) {
          throw new EmploymentStatusBusinessException(
            'Employment status creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EMPLOYMENT_STATUS_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_STATUSES,
          details: JSON.stringify({
            id: created_employment_status.id,
            desc1: created_employment_status.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_employment_status.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_employment_status;
      },
    );
  }
}
