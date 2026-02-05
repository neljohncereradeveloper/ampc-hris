import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { WorkExperienceBusinessException } from '@/features/201-management/domain/exceptions';
import { WorkExperienceRepository } from '@/features/201-management/domain/repositories';
import {
  WORK_EXPERIENCE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class RestoreWorkExperienceUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE)
    private readonly workExperienceRepository: WorkExperienceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      WORK_EXPERIENCE_ACTIONS.RESTORE,
      async (manager) => {
        const work_experience = await this.workExperienceRepository.findById(
          id,
          manager,
        );
        if (!work_experience) {
          throw new WorkExperienceBusinessException(
            `Work experience with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        work_experience.restore();

        const success = await this.workExperienceRepository.update(
          id,
          work_experience,
          manager,
        );
        if (!success) {
          throw new WorkExperienceBusinessException(
            'Work experience restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: WORK_EXPERIENCE_ACTIONS.RESTORE,
          entity: MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCES,
          details: JSON.stringify({
            id,
            employee_id: work_experience.employee_id,
            company_id: work_experience.company_id,
            work_experience_job_title_id:
              work_experience.work_experience_job_title_id,
            years: work_experience.years,
            explanation: `Work experience with ID : ${id} restored by USER : ${requestInfo?.user_name || ''
              }`,
            restored_by: requestInfo?.user_name || '',
            restored_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
