import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { CitizenshipBusinessException } from '@/features/201-management/domain/exceptions';
import { Citizenship } from '@/features/201-management/domain/models';
import { CitizenshipRepository } from '@/features/201-management/domain/repositories';
import {
  CITIZENSHIP_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { CreateCitizenshipCommand } from '../../commands/citizenship/create-citizenship.command';

@Injectable()
export class CreateCitizenshipUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.CITIZENSHIP)
    private readonly citizenshipRepository: CitizenshipRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    command: CreateCitizenshipCommand,
    requestInfo?: RequestInfo,
  ): Promise<Citizenship> {
    return this.transactionHelper.executeTransaction(
      CITIZENSHIP_ACTIONS.CREATE,
      async (manager) => {
        const new_citizenship = Citizenship.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        const created_citizenship = await this.citizenshipRepository.create(
          new_citizenship,
          manager,
        );

        if (!created_citizenship) {
          throw new CitizenshipBusinessException(
            'Citizenship creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: CITIZENSHIP_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.CITIZENSHIPS,
          details: JSON.stringify({
            id: created_citizenship.id,
            desc1: created_citizenship.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_citizenship.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_citizenship;
      },
    );
  }
}
