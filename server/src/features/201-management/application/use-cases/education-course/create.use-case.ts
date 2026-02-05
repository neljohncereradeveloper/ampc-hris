import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EducationCourseBusinessException } from '@/features/201-management/domain/exceptions';
import { EducationCourse } from '@/features/201-management/domain/models';
import { EducationCourseRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_COURSE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { CreateEducationCourseCommand } from '../../commands/education-course/create-education-course.command';

@Injectable()
export class CreateEducationCourseUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_COURSE)
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
        // Create domain model (validates automatically)
        const new_education_course = EducationCourse.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        // Persist the entity
        const created_education_course =
          await this.educationCourseRepository.create(
            new_education_course,
            manager,
          );

        if (!created_education_course) {
          throw new EducationCourseBusinessException(
            'Education course creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the creation
        const log = ActivityLog.create({
          action: EDUCATION_COURSE_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATION_COURSES,
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
