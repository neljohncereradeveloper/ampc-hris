import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EducationCourseLevelBusinessException } from '@/features/test/domain/exceptions';
import { EducationCourseLevel } from '@/features/test/domain/models';
import { EducationCourseLevelRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_COURSE_LEVEL_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { CreateEducationCourseLevelCommand } from '../../commands/education-course-level/create-education-course-level.command';

@Injectable()
export class CreateEducationCourseLevelUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.EDUCATION_COURSE_LEVEL)
    private readonly educationCourseLevelRepository: EducationCourseLevelRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateEducationCourseLevelCommand,
    requestInfo?: RequestInfo,
  ): Promise<EducationCourseLevel> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_LEVEL_ACTIONS.CREATE,
      async (manager) => {
        const new_education_course_level = EducationCourseLevel.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || '',
        });

        const created_education_course_level =
          await this.educationCourseLevelRepository.create(
            new_education_course_level,
            manager,
          );

        if (!created_education_course_level) {
          throw new EducationCourseLevelBusinessException(
            'EducationCourseLevel creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EDUCATION_COURSE_LEVEL_ACTIONS.CREATE,
          entity: TEST_DATABASE_MODELS.EDUCATION_COURSE_LEVELS,
          details: JSON.stringify({
            id: created_education_course_level.id,
            desc1: created_education_course_level.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(
              created_education_course_level.created_at,
            ),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_education_course_level;
      },
    );
  }
}
