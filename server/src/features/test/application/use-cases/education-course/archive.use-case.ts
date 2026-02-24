import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EducationCourseBusinessException } from '@/features/test/domain/exceptions';
import { EducationCourseRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_COURSE_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveEducationCourseUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.EDUCATION_COURSE)
    private readonly educationCourseRepository: EducationCourseRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_ACTIONS.ARCHIVE,
      async (manager) => {
        const education_course = await this.educationCourseRepository.findById(
          id,
          manager,
        );
        if (!education_course) {
          throw new EducationCourseBusinessException(
            `educationCourse with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        education_course.archive(requestInfo?.user_name || '');

        const success = await this.educationCourseRepository.update(
          id,
          education_course,
          manager,
        );
        if (!success) {
          throw new EducationCourseBusinessException(
            'EducationCourse archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EDUCATION_COURSE_ACTIONS.ARCHIVE,
          entity: TEST_DATABASE_MODELS.EDUCATION_COURSES,
          details: JSON.stringify({
            id,
            desc1: education_course.desc1,
            explanation: `educationCourse with ID : ${id} archived by USER : ${requestInfo?.user_name || ''}`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(
              education_course.deleted_at || new Date(),
            ),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
