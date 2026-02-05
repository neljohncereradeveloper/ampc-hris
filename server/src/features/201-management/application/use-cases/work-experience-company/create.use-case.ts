import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { WorkExperienceCompanyBusinessException } from '@/features/201-management/domain/exceptions';
import { WorkExperienceCompany } from '@/features/201-management/domain/models';
import { WorkExperienceCompanyRepository } from '@/features/201-management/domain/repositories';
import {
  WORK_EXPERIENCE_COMPANY_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { CreateWorkExperienceCompanyCommand } from '../../commands/work-experience-company/create-work-experience-company.command';

@Injectable()
export class CreateWorkExperienceCompanyUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_COMPANY)
    private readonly workExperienceCompanyRepository: WorkExperienceCompanyRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    command: CreateWorkExperienceCompanyCommand,
    requestInfo?: RequestInfo,
  ): Promise<WorkExperienceCompany> {
    return this.transactionHelper.executeTransaction(
      WORK_EXPERIENCE_COMPANY_ACTIONS.CREATE,
      async (manager) => {
        // Create domain model (validates automatically)
        const new_work_experience_company = WorkExperienceCompany.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        // Persist the entity
        const created_work_experience_company =
          await this.workExperienceCompanyRepository.create(
            new_work_experience_company,
            manager,
          );

        if (!created_work_experience_company) {
          throw new WorkExperienceCompanyBusinessException(
            'Work experience company creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the creation
        const log = ActivityLog.create({
          action: WORK_EXPERIENCE_COMPANY_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_COMPANIES,
          details: JSON.stringify({
            id: created_work_experience_company.id,
            desc1: created_work_experience_company.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(
              created_work_experience_company.created_at,
            ),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_work_experience_company;
      },
    );
  }
}
