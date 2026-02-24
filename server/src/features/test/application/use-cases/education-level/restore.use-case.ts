import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EducationLevelBusinessException } from '@/features/test/domain/exceptions';
import { EducationLevelRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_LEVEL_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';

@Injectable()
export class RestoreEducationLevelUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.EDUCATION_LEVEL)
    private readonly educationLevelRepository: EducationLevelRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_LEVEL_ACTIONS.RESTORE,
      async (manager) => {
        const education_level = await this.educationLevelRepository.findById(
          id,
          manager,
        );
        if (!education_level) {
          throw new EducationLevelBusinessException(
            `EducationLevel with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        education_level.restore();

        const success = await this.educationLevelRepository.update(
          id,
          education_level,
          manager,
        );
        if (!success) {
          throw new EducationLevelBusinessException(
            'EducationLevel restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EDUCATION_LEVEL_ACTIONS.RESTORE,
          entity: TEST_DATABASE_MODELS.EDUCATION_LEVELS,
          details: JSON.stringify({
            id,
            desc1: education_level.desc1,
            explanation: `EducationLevel with ID : ${id} restored by USER : ${requestInfo?.user_name || ''}`,
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
