import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EducationCourseLevelBusinessException } from '@/features/201-management/domain/exceptions';
import { EducationCourseLevelRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_COURSE_LEVEL_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveEducationCourseLevelUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_COURSE_LEVEL)
    private readonly educationCourseLevelRepository: EducationCourseLevelRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_LEVEL_ACTIONS.ARCHIVE,
      async (manager) => {
        // Validate existence
        const education_course_level =
          await this.educationCourseLevelRepository.findById(id, manager);
        if (!education_course_level) {
          throw new EducationCourseLevelBusinessException(
            `Education course level with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Use domain method to archive (soft delete)
        education_course_level.archive(requestInfo?.user_name || '');

        // Update the entity
        const success = await this.educationCourseLevelRepository.update(
          id,
          education_course_level,
          manager,
        );
        if (!success) {
          throw new EducationCourseLevelBusinessException(
            'Education course level archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the archive
        const log = ActivityLog.create({
          action: EDUCATION_COURSE_LEVEL_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATION_COURSE_LEVELS,
          details: JSON.stringify({
            id,
            desc1: education_course_level.desc1,
            explanation: `Education course level with ID : ${id} archived by USER : ${requestInfo?.user_name || ''}`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(
              education_course_level.deleted_at || new Date(),
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
