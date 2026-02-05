import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { CitizenshipBusinessException } from '@/features/201-management/domain/exceptions';
import { CitizenshipRepository } from '@/features/201-management/domain/repositories';
import {
  CITIZENSHIP_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class RestoreCitizenshipUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.CITIZENSHIP)
    private readonly citizenshipRepository: CitizenshipRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      CITIZENSHIP_ACTIONS.RESTORE,
      async (manager) => {
        const citizenship = await this.citizenshipRepository.findById(
          id,
          manager,
        );
        if (!citizenship) {
          throw new CitizenshipBusinessException(
            `Citizenship with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        citizenship.restore();

        const success = await this.citizenshipRepository.update(
          id,
          citizenship,
          manager,
        );
        if (!success) {
          throw new CitizenshipBusinessException(
            'Citizenship restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: CITIZENSHIP_ACTIONS.RESTORE,
          entity: MANAGEMENT_201_DATABASE_MODELS.CITIZENSHIPS,
          details: JSON.stringify({
            id,
            desc1: citizenship.desc1,
            explanation: `Citizenship with ID : ${id} restored by USER : ${requestInfo?.user_name || ''
              }`,
            restored_by: requestInfo?.user_name || '',
            restored_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
