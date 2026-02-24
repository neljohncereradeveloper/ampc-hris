import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EducationLevelBusinessException } from '@/features/test/domain/exceptions';
import { EducationLevel } from '@/features/test/domain/models';
import { EducationLevelRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_LEVEL_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { CreateEducationLevelCommand } from '../../commands/education-level/create-education-level.command';

@Injectable()
export class CreateEducationLevelUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.EDUCATION_LEVEL)
    private readonly educationLevelRepository: EducationLevelRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateEducationLevelCommand,
    requestInfo?: RequestInfo,
  ): Promise<EducationLevel> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_LEVEL_ACTIONS.CREATE,
      async (manager) => {
        const new_education_level = EducationLevel.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || '',
        });

        const created_education_level =
          await this.educationLevelRepository.create(
            new_education_level,
            manager,
          );

        if (!created_education_level) {
          throw new EducationLevelBusinessException(
            'EducationLevel creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EDUCATION_LEVEL_ACTIONS.CREATE,
          entity: TEST_DATABASE_MODELS.EDUCATION_LEVELS,
          details: JSON.stringify({
            id: created_education_level.id,
            desc1: created_education_level.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_education_level.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_education_level;
      },
    );
  }
}
