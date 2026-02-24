import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EducationCourseBusinessException } from '@/features/test/domain/exceptions';
import { EducationCourse } from '@/features/test/domain/models';
import { EducationCourseRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_COURSE_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { CreateEducationCourseCommand } from '../../commands/education-course/create-education-course.command';

@Injectable()
export class CreateEducationCourseUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.EDUCATION_COURSE)
    private readonly educationCourseRepository: EducationCourseRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateEducationCourseCommand,
    requestInfo?: RequestInfo,
  ): Promise<EducationCourse> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_ACTIONS.CREATE,
      async (manager) => {
        const new_education_course = EducationCourse.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || '',
        });

        const created_education_course =
          await this.educationCourseRepository.create(
            new_education_course,
            manager,
          );

        if (!created_education_course) {
          throw new EducationCourseBusinessException(
            'EducationCourse creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EDUCATION_COURSE_ACTIONS.CREATE,
          entity: TEST_DATABASE_MODELS.EDUCATION_COURSES,
          details: JSON.stringify({
            id: created_education_course.id,
            desc1: created_education_course.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_education_course.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_education_course;
      },
    );
  }
}
