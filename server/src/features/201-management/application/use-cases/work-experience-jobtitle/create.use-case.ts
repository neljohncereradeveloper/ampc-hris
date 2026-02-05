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
import { CreateWorkExperienceJobTitleCommand } from '../../commands/work-experience-jobtitle/create-work-experience-jobtitle.command';

@Injectable()
export class CreateWorkExperienceJobTitleUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_JOBTITLE)
    private readonly workExperienceJobTitleRepository: WorkExperienceJobTitleRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    command: CreateWorkExperienceJobTitleCommand,
    requestInfo?: RequestInfo,
  ): Promise<WorkExperienceJobTitle> {
    return this.transactionHelper.executeTransaction(
      WORK_EXPERIENCE_JOBTITLE_ACTIONS.CREATE,
      async (manager) => {
        // Create domain model (validates automatically)
        const new_work_experience_job_title = WorkExperienceJobTitle.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        // Persist the entity
        const created_work_experience_job_title =
          await this.workExperienceJobTitleRepository.create(
            new_work_experience_job_title,
            manager,
          );

        if (!created_work_experience_job_title) {
          throw new WorkExperienceJobTitleBusinessException(
            'Work experience job title creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the creation
        const log = ActivityLog.create({
          action: WORK_EXPERIENCE_JOBTITLE_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_JOBTITLES,
          details: JSON.stringify({
            id: created_work_experience_job_title.id,
            desc1: created_work_experience_job_title.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(
              created_work_experience_job_title.created_at,
            ),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_work_experience_job_title;
      },
    );
  }
}
