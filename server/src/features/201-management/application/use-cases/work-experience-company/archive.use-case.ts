import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { WorkExperienceCompanyBusinessException } from '@/features/201-management/domain/exceptions';
import { WorkExperienceCompanyRepository } from '@/features/201-management/domain/repositories';
import {
  WORK_EXPERIENCE_COMPANY_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveWorkExperienceCompanyUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_COMPANY)
    private readonly workExperienceCompanyRepository: WorkExperienceCompanyRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      WORK_EXPERIENCE_COMPANY_ACTIONS.ARCHIVE,
      async (manager) => {
        // Validate existence
        const work_experience_company =
          await this.workExperienceCompanyRepository.findById(id, manager);
        if (!work_experience_company) {
          throw new WorkExperienceCompanyBusinessException(
            `Work experience company with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Use domain method to archive (soft delete)
        work_experience_company.archive(requestInfo?.user_name || '');

        // Update the entity
        const success = await this.workExperienceCompanyRepository.update(
          id,
          work_experience_company,
          manager,
        );
        if (!success) {
          throw new WorkExperienceCompanyBusinessException(
            'Work experience company archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the archive
        const log = ActivityLog.create({
          action: WORK_EXPERIENCE_COMPANY_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_COMPANIES,
          details: JSON.stringify({
            id,
            desc1: work_experience_company.desc1,
            explanation: `Work experience company with ID : ${id} archived by USER : ${
              requestInfo?.user_name || ''
            }`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(
              work_experience_company.deleted_at || new Date(),
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
