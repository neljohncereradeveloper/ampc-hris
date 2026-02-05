import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EmploymentTypeBusinessException } from '@/features/201-management/domain/exceptions';
import { EmploymentTypeRepository } from '@/features/201-management/domain/repositories';
import {
  EMPLOYMENT_TYPE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveEmploymentTypeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EMPLOYMENT_TYPE)
    private readonly employmentTypeRepository: EmploymentTypeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EMPLOYMENT_TYPE_ACTIONS.ARCHIVE,
      async (manager) => {
        const employment_type = await this.employmentTypeRepository.findById(
          id,
          manager,
        );
        if (!employment_type) {
          throw new EmploymentTypeBusinessException(
            `Employment type with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        employment_type.archive(requestInfo?.user_name || '');

        const success = await this.employmentTypeRepository.update(
          id,
          employment_type,
          manager,
        );
        if (!success) {
          throw new EmploymentTypeBusinessException(
            'Employment type archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EMPLOYMENT_TYPE_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_TYPES,
          details: JSON.stringify({
            id,
            desc1: employment_type.desc1,
            explanation: `Employment type with ID : ${id} archived by USER : ${requestInfo?.user_name || ''
              }`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(employment_type.deleted_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
