import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EducationSchoolBusinessException } from '@/features/test/domain/exceptions';
import { EducationSchool } from '@/features/test/domain/models';
import { EducationSchoolRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_SCHOOL_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { CreateEducationSchoolCommand } from '../../commands/education-school/create-education-school.command';

@Injectable()
export class CreateEducationSchoolUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.EDUCATION_SCHOOL)
    private readonly educationSchoolRepository: EducationSchoolRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateEducationSchoolCommand,
    requestInfo?: RequestInfo,
  ): Promise<EducationSchool> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_SCHOOL_ACTIONS.CREATE,
      async (manager) => {
        const new_education_school = EducationSchool.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || '',
        });

        const created_education_school =
          await this.educationSchoolRepository.create(
            new_education_school,
            manager,
          );

        if (!created_education_school) {
          throw new EducationSchoolBusinessException(
            'EducationSchool creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EDUCATION_SCHOOL_ACTIONS.CREATE,
          entity: TEST_DATABASE_MODELS.EDUCATION_SCHOOLS,
          details: JSON.stringify({
            id: created_education_school.id,
            desc1: created_education_school.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_education_school.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_education_school;
      },
    );
  }
}
