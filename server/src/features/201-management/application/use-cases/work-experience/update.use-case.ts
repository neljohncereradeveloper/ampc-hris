import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { WorkExperienceBusinessException } from '@/features/201-management/domain/exceptions';
import { WorkExperience } from '@/features/201-management/domain/models';
import {
  WorkExperienceRepository,
  WorkExperienceCompanyRepository,
  WorkExperienceJobTitleRepository,
} from '@/features/201-management/domain/repositories';
import {
  WORK_EXPERIENCE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { UpdateWorkExperienceCommand } from '../../commands/work-experience/update-work-experience.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateWorkExperienceUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE)
    private readonly workExperienceRepository: WorkExperienceRepository,
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_COMPANY)
    private readonly workExperienceCompanyRepository: WorkExperienceCompanyRepository,
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_JOBTITLE)
    private readonly workExperienceJobTitleRepository: WorkExperienceJobTitleRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateWorkExperienceCommand,
    requestInfo?: RequestInfo,
  ): Promise<WorkExperience | null> {
    return this.transactionHelper.executeTransaction(
      WORK_EXPERIENCE_ACTIONS.UPDATE,
      async (manager) => {
        const work_experience = await this.workExperienceRepository.findById(
          id,
          manager,
        );
        if (!work_experience) {
          throw new WorkExperienceBusinessException(
            'Work experience not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Validate company exists if company_id is provided
        let work_experience_company = null;
        if (command.company_id !== undefined && command.company_id !== null) {
          work_experience_company =
            await this.workExperienceCompanyRepository.findById(
              command.company_id,
              manager,
            );
          if (!work_experience_company) {
            throw new WorkExperienceBusinessException(
              `Work experience company with ID ${command.company_id} not found.`,
              HTTP_STATUS.NOT_FOUND,
            );
          }
        }

        // Validate job title exists if work_experience_job_title_id is provided
        let work_experience_job_title = null;
        if (
          command.work_experience_job_title_id !== undefined &&
          command.work_experience_job_title_id !== null
        ) {
          work_experience_job_title =
            await this.workExperienceJobTitleRepository.findById(
              command.work_experience_job_title_id,
              manager,
            );
          if (!work_experience_job_title) {
            throw new WorkExperienceBusinessException(
              `Work experience job title with ID ${command.work_experience_job_title_id} not found.`,
              HTTP_STATUS.NOT_FOUND,
            );
          }
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'company_id' },
          { field: 'work_experience_job_title_id' },
          { field: 'years' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(
          work_experience,
          tracking_config,
        );

        work_experience.update({
          company_id: command.company_id,
          work_experience_job_title_id: command.work_experience_job_title_id,
          years: command.years,
          updated_by: requestInfo?.user_name || null,
        });

        const success = await this.workExperienceRepository.update(
          id,
          work_experience,
          manager,
        );
        if (!success) {
          throw new WorkExperienceBusinessException(
            'Work experience update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.workExperienceRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: WORK_EXPERIENCE_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCES,
          details: JSON.stringify({
            id: updated_result?.id,
            changed_fields: changed_fields,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(updated_result?.updated_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_result;
      },
    );
  }
}
