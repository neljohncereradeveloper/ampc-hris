import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
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
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveCitizenshipUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.CITIZENSHIP)
    private readonly citizenshipRepository: CitizenshipRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      CITIZENSHIP_ACTIONS.ARCHIVE,
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

        citizenship.archive(requestInfo?.user_name || '');

        const success = await this.citizenshipRepository.update(
          id,
          citizenship,
          manager,
        );
        if (!success) {
          throw new CitizenshipBusinessException(
            'Citizenship archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: CITIZENSHIP_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.CITIZENSHIPS,
          details: JSON.stringify({
            id,
            desc1: citizenship.desc1,
            explanation: `Citizenship with ID : ${id} archived by USER : ${
              requestInfo?.user_name || ''
            }`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(citizenship.deleted_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
