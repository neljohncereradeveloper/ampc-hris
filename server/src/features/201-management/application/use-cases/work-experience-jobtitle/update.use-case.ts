import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { WorkExperienceJobTitleBusinessException } from '@/features/201-management/domain/exceptions';
import { WorkExperienceJobTitle } from '@/features/201-management/domain/models';
import { WorkExperienceJobTitleRepository } from '@/features/201-management/domain/repositories';
import {
  WORK_EXPERIENCE_JOBTITLE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { UpdateWorkExperienceJobTitleCommand } from '../../commands/work-experience-jobtitle/update-work-experience-jobtitle.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateWorkExperienceJobTitleUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_JOBTITLE)
    private readonly workExperienceJobTitleRepository: WorkExperienceJobTitleRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    id: number,
    command: UpdateWorkExperienceJobTitleCommand,
    requestInfo?: RequestInfo,
  ): Promise<WorkExperienceJobTitle | null> {
    return this.transactionHelper.executeTransaction(
      WORK_EXPERIENCE_JOBTITLE_ACTIONS.UPDATE,
      async (manager) => {
        // Validate work experience job title existence
        const work_experience_job_title =
          await this.workExperienceJobTitleRepository.findById(id, manager);
        if (!work_experience_job_title) {
          throw new WorkExperienceJobTitleBusinessException(
            'Work experience job title not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Define fields to track for change logging
        const tracking_config: FieldExtractorConfig[] = [
          { field: 'desc1' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        // Capture before state for logging
        const before_state = extractEntityState(
          work_experience_job_title,
          tracking_config,
        );

        // Use domain model method to update (encapsulates business logic and validation)
        work_experience_job_title.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name || null,
        });

        // Update the work experience job title in the database
        const success = await this.workExperienceJobTitleRepository.update(
          id,
          work_experience_job_title,
          manager,
        );
        if (!success) {
          throw new WorkExperienceJobTitleBusinessException(
            'Work experience job title update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Retrieve the updated work experience job title
        const updated_result =
          await this.workExperienceJobTitleRepository.findById(id, manager);

        // Capture after state for logging
        const after_state = extractEntityState(
          updated_result,
          tracking_config,
        );

        // Get only the changed fields with old and new states
        const changed_fields = getChangedFields(before_state, after_state);

        // Log the update with only changed fields (old state and new state)
        const log = ActivityLog.create({
          action: WORK_EXPERIENCE_JOBTITLE_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_JOBTITLES,
          details: JSON.stringify({
            id: updated_result?.id,
            changed_fields: changed_fields,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(
              updated_result?.updated_at || new Date(),
            ),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_result;
      },
    );
  }
}
