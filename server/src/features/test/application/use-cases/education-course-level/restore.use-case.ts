import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EducationCourseLevelBusinessException } from '@/features/test/domain/exceptions';
import { EducationCourseLevelRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_COURSE_LEVEL_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';

@Injectable()
export class RestoreEducationCourseLevelUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.EDUCATION_COURSE_LEVEL)
    private readonly educationCourseLevelRepository: EducationCourseLevelRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_LEVEL_ACTIONS.RESTORE,
      async (manager) => {
        const education_course_level =
          await this.educationCourseLevelRepository.findById(id, manager);
        if (!education_course_level) {
          throw new EducationCourseLevelBusinessException(
            `EducationCourseLevel with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        education_course_level.restore();

        const success = await this.educationCourseLevelRepository.update(
          id,
          education_course_level,
          manager,
        );
        if (!success) {
          throw new EducationCourseLevelBusinessException(
            'EducationCourseLevel restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EDUCATION_COURSE_LEVEL_ACTIONS.RESTORE,
          entity: TEST_DATABASE_MODELS.EDUCATION_COURSE_LEVELS,
          details: JSON.stringify({
            id,
            desc1: education_course_level.desc1,
            explanation: `EducationCourseLevel with ID : ${id} restored by USER : ${requestInfo?.user_name || ''}`,
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
