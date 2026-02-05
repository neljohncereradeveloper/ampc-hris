import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { WorkExperienceJobTitleBusinessException } from '@/features/201-management/domain/exceptions';
import { WorkExperienceJobTitleRepository } from '@/features/201-management/domain/repositories';
import {
  WORK_EXPERIENCE_JOBTITLE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveWorkExperienceJobTitleUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_JOBTITLE)
    private readonly workExperienceJobTitleRepository: WorkExperienceJobTitleRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      WORK_EXPERIENCE_JOBTITLE_ACTIONS.ARCHIVE,
      async (manager) => {
        // Validate existence
        const work_experience_job_title =
          await this.workExperienceJobTitleRepository.findById(id, manager);
        if (!work_experience_job_title) {
          throw new WorkExperienceJobTitleBusinessException(
            `Work experience job title with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Use domain method to archive (soft delete)
        work_experience_job_title.archive(requestInfo?.user_name || '');

        // Update the entity
        const success = await this.workExperienceJobTitleRepository.update(
          id,
          work_experience_job_title,
          manager,
        );
        if (!success) {
          throw new WorkExperienceJobTitleBusinessException(
            'Work experience job title archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the archive
        const log = ActivityLog.create({
          action: WORK_EXPERIENCE_JOBTITLE_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_JOBTITLES,
          details: JSON.stringify({
            id,
            desc1: work_experience_job_title.desc1,
            explanation: `Work experience job title with ID : ${id} archived by USER : ${requestInfo?.user_name || ''
              }`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(
              work_experience_job_title.deleted_at || new Date(),
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
