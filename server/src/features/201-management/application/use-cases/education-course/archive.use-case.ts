import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EducationCourseBusinessException } from '@/features/201-management/domain/exceptions';
import { EducationCourseRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_COURSE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveEducationCourseUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_COURSE)
    private readonly educationCourseRepository: EducationCourseRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_ACTIONS.ARCHIVE,
      async (manager) => {
        // Validate existence
        const education_course = await this.educationCourseRepository.findById(
          id,
          manager,
        );
        if (!education_course) {
          throw new EducationCourseBusinessException(
            `Education course with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Use domain method to archive (soft delete)
        education_course.archive(requestInfo?.user_name || '');

        // Update the entity
        const success = await this.educationCourseRepository.update(
          id,
          education_course,
          manager,
        );
        if (!success) {
          throw new EducationCourseBusinessException(
            'Education course archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the archive
        const log = ActivityLog.create({
          action: EDUCATION_COURSE_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATION_COURSES,
          details: JSON.stringify({
            id,
            desc1: education_course.desc1,
            explanation: `Education course with ID : ${id} archived by USER : ${requestInfo?.user_name || ''}`,
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
