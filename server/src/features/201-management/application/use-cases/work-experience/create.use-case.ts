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
import { CreateWorkExperienceCommand } from '../../commands/work-experience/create-work-experience.command';

@Injectable()
export class CreateWorkExperienceUseCase {
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
  ) { }

  async execute(
    command: CreateWorkExperienceCommand,
    requestInfo?: RequestInfo,
  ): Promise<WorkExperience> {
    return this.transactionHelper.executeTransaction(
      WORK_EXPERIENCE_ACTIONS.CREATE,
      async (manager) => {
        const new_work_experience = WorkExperience.create({
          employee_id: command.employee_id,
          company_id: command.company_id,
          work_experience_job_title_id: command.work_experience_job_title_id,
          years: command.years,
          created_by: requestInfo?.user_name || null,
        });

        // Validate company exists if company_id is provided
        if (
          command.company_id !== undefined &&
          command.company_id !== null
        ) {
          const work_experience_company =
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
        if (
          command.work_experience_job_title_id !== undefined &&
          command.work_experience_job_title_id !== null
        ) {
          const work_experience_job_title =
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

        const created_work_experience =
          await this.workExperienceRepository.create(
            new_work_experience,
            manager,
          );

        if (!created_work_experience) {
          throw new WorkExperienceBusinessException(
            'Work experience creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: WORK_EXPERIENCE_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCES,
          details: JSON.stringify({
            id: created_work_experience.id,
            employee_id: created_work_experience.employee_id,
            company_id: created_work_experience.company_id,
            work_experience_job_title_id:
              created_work_experience.work_experience_job_title_id,
            years: created_work_experience.years,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_work_experience.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_work_experience;
      },
    );
  }
}
