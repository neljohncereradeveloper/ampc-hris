import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EducationCourseBusinessException } from '@/features/test/domain/exceptions';
import { EducationCourseRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_COURSE_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';

@Injectable()
export class RestoreEducationCourseUseCase {
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
      EDUCATION_COURSE_ACTIONS.RESTORE,
      async (manager) => {
        const education_course = await this.educationCourseRepository.findById(
          id,
          manager,
        );
        if (!education_course) {
          throw new EducationCourseBusinessException(
            `EducationCourse with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        education_course.restore();

        const success = await this.educationCourseRepository.update(
          id,
          education_course,
          manager,
        );
        if (!success) {
          throw new EducationCourseBusinessException(
            'EducationCourse restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EDUCATION_COURSE_ACTIONS.RESTORE,
          entity: TEST_DATABASE_MODELS.EDUCATION_COURSES,
          details: JSON.stringify({
            id,
            desc1: education_course.desc1,
            explanation: `EducationCourse with ID : ${id} restored by USER : ${requestInfo?.user_name || ''}`,
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
