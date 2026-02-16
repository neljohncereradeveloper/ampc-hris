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
import { CreateReligionCommand } from '../../commands/religion/create-religion.command';

@Injectable()
export class CreateReligionUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.RELIGION)
    private readonly religionRepository: ReligionRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateReligionCommand,
    requestInfo?: RequestInfo,
  ): Promise<Religion> {
    return this.transactionHelper.executeTransaction(
      RELIGION_ACTIONS.CREATE,
      async (manager) => {
        const new_religion = Religion.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        const created_religion = await this.religionRepository.create(
          new_religion,
          manager,
        );

        if (!created_religion) {
          throw new ReligionBusinessException(
            'Religion creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: RELIGION_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.RELIGIONS,
          details: JSON.stringify({
            id: created_religion.id,
            desc1: created_religion.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_religion.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_religion;
      },
    );
  }
}
