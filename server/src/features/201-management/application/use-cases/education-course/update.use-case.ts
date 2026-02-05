import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
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
import { UpdateEducationCourseCommand } from '../../commands/education-course/update-education-course.command';
import {
  getChangedFields,
  extractEntityState,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateEducationCourseUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_COURSE)
    private readonly educationCourseRepository: EducationCourseRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateEducationCourseCommand,
    requestInfo?: RequestInfo,
  ): Promise<EducationCourse> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_ACTIONS.UPDATE,
      async (manager) => {
        // Validate existence
        const existing_education_course =
          await this.educationCourseRepository.findById(id, manager);
        if (!existing_education_course) {
          throw new EducationCourseBusinessException(
            `Education course with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Store original state for change tracking
        const originalState = extractEntityState(existing_education_course);

        // Use domain method to update (validates automatically)
        existing_education_course.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name || null,
        });

        // Update the entity
        const success = await this.educationCourseRepository.update(
          id,
          existing_education_course,
          manager,
        );
        if (!success) {
          throw new EducationCourseBusinessException(
            'Education course update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Fetch updated entity for logging
        const updated_education_course =
          await this.educationCourseRepository.findById(id, manager);
        if (!updated_education_course) {
          throw new EducationCourseBusinessException(
            'Failed to fetch updated education course',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Track changes
        const newState = extractEntityState(updated_education_course);
        const changedFields = getChangedFields(originalState, newState);

        // Log the update
        const log = ActivityLog.create({
          action: EDUCATION_COURSE_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATION_COURSES,
          details: JSON.stringify({
            id,
            changed_fields: changedFields,
            original: originalState,
            updated: newState,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(updated_education_course.updated_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_education_course;
      },
    );
  }
}
