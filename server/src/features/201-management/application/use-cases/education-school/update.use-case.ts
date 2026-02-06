import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EducationSchool } from '@/features/201-management/domain/models';
import { EducationSchoolBusinessException } from '@/features/201-management/domain/exceptions';
import { EducationSchoolRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_SCHOOL_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { UpdateEducationSchoolCommand } from '../../commands/education-school/update-education-school.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateEducationSchoolUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_SCHOOL)
    private readonly educationSchoolRepository: EducationSchoolRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    id: number,
    command: UpdateEducationSchoolCommand,
    requestInfo?: RequestInfo,
  ): Promise<EducationSchool> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_SCHOOL_ACTIONS.UPDATE,
      async (manager) => {
        // Validate existence
        const existing_education_school =
          await this.educationSchoolRepository.findById(id, manager);
        if (!existing_education_school) {
          throw new EducationSchoolBusinessException(
            `Education school with ID ${id} not found.`,
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
          existing_education_school,
          tracking_config,
        );

        // Use domain method to update (validates automatically)
        existing_education_school.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name || null,
        });

        // Update the entity
        const success = await this.educationSchoolRepository.update(
          id,
          existing_education_school,
          manager,
        );
        if (!success) {
          throw new EducationSchoolBusinessException(
            'Education school update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Fetch updated entity for logging
        const updated_education_school =
          await this.educationSchoolRepository.findById(id, manager);
        if (!updated_education_school) {
          throw new EducationSchoolBusinessException(
            'Failed to fetch updated education school',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Track changes
        const newState = extractEntityState(
          updated_education_school,
          tracking_config,
        );
        const changedFields = getChangedFields(originalState, newState);

        // Log the update
        const log = ActivityLog.create({
          action: EDUCATION_SCHOOL_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATION_SCHOOLS,
          details: JSON.stringify({
            id,
            changed_fields: changedFields,
            original: originalState,
            updated: newState,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(updated_education_school.updated_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_education_school;
      },
    );
  }
}
