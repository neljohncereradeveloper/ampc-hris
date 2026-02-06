import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EducationBusinessException } from '@/features/201-management/domain/exceptions';
import { EducationRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class RestoreEducationUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION)
    private readonly educationRepository: EducationRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_ACTIONS.RESTORE,
      async (manager) => {
        const education = await this.educationRepository.findById(id, manager);
        if (!education) {
          throw new EducationBusinessException(
            `Education record with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        education.restore();

        const success = await this.educationRepository.update(
          id,
          education,
          manager,
        );
        if (!success) {
          throw new EducationBusinessException(
            'Education restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EDUCATION_ACTIONS.RESTORE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATIONS,
          details: JSON.stringify({
            id,
            employee_id: education.employee_id,
            school_year: education.school_year,
            explanation: `Education record with ID ${id} restored by USER : ${requestInfo?.user_name || ''}`,
            restored_by: requestInfo?.user_name || '',
            restored_at: getPHDateTime(),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
