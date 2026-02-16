import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EducationCourseLevel } from '@/features/201-management/domain/models';
import { EducationCourseLevelBusinessException } from '@/features/201-management/domain/exceptions';
import { EducationCourseLevelRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_COURSE_LEVEL_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { UpdateEducationCourseLevelCommand } from '../../commands/education-course-level/update-education-course-level.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateEducationCourseLevelUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_COURSE_LEVEL)
    private readonly educationCourseLevelRepository: EducationCourseLevelRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateEducationCourseLevelCommand,
    requestInfo?: RequestInfo,
  ): Promise<EducationCourseLevel> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_LEVEL_ACTIONS.UPDATE,
      async (manager) => {
        // Validate existence
        const existing_education_course_level =
          await this.educationCourseLevelRepository.findById(id, manager);
        if (!existing_education_course_level) {
          throw new EducationCourseLevelBusinessException(
            `Education course level with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Store original state for change tracking
        const tracking_config: FieldExtractorConfig[] = [
          { field: 'desc1' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];
        const originalState = extractEntityState(
          existing_education_course_level,
          tracking_config,
        );

        // Use domain method to update (validates automatically)
        existing_education_course_level.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name || null,
        });

        // Update the entity
        const success = await this.educationCourseLevelRepository.update(
          id,
          existing_education_course_level,
          manager,
        );
        if (!success) {
          throw new EducationCourseLevelBusinessException(
            'Education course level update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Fetch updated entity for logging
        const updated_education_course_level =
          await this.educationCourseLevelRepository.findById(id, manager);
        if (!updated_education_course_level) {
          throw new EducationCourseLevelBusinessException(
            'Failed to fetch updated education course level',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Track changes
        const newState = extractEntityState(
          updated_education_course_level,
          tracking_config,
        );
        const changedFields = getChangedFields(originalState, newState);

        // Log the update
        const log = ActivityLog.create({
          action: EDUCATION_COURSE_LEVEL_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATION_COURSE_LEVELS,
          details: JSON.stringify({
            id,
            changed_fields: changedFields,
            original: originalState,
            updated: newState,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(
              updated_education_course_level.updated_at,
            ),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_education_course_level;
      },
    );
  }
}
