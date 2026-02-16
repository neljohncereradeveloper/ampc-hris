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
import { CreateCivilStatusCommand } from '../../commands/civil-status/create-civil-status.command';

@Injectable()
export class CreateCivilStatusUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.CIVIL_STATUS)
    private readonly civilStatusRepository: CivilStatusRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateCivilStatusCommand,
    requestInfo?: RequestInfo,
  ): Promise<CivilStatus> {
    return this.transactionHelper.executeTransaction(
      CIVIL_STATUS_ACTIONS.CREATE,
      async (manager) => {
        const new_civil_status = CivilStatus.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        const created_civil_status = await this.civilStatusRepository.create(
          new_civil_status,
          manager,
        );

        if (!created_civil_status) {
          throw new CivilStatusBusinessException(
            'Civil status creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: CIVIL_STATUS_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.CIVIL_STATUSES,
          details: JSON.stringify({
            id: created_civil_status.id,
            desc1: created_civil_status.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_civil_status.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_civil_status;
      },
    );
  }
}
