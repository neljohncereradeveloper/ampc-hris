import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EducationSchoolBusinessException } from '@/features/201-management/domain/exceptions';
import { EducationSchoolRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_SCHOOL_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class RestoreEducationSchoolUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_SCHOOL)
    private readonly educationSchoolRepository: EducationSchoolRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_SCHOOL_ACTIONS.RESTORE,
      async (manager) => {
        // Validate existence
        const education_school = await this.educationSchoolRepository.findById(
          id,
          manager,
        );
        if (!education_school) {
          throw new EducationSchoolBusinessException(
            `Education school with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Use domain method to restore
        education_school.restore();

        // Update the entity
        const success = await this.educationSchoolRepository.update(
          id,
          education_school,
          manager,
        );
        if (!success) {
          throw new EducationSchoolBusinessException(
            'Education school restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the restore
        const log = ActivityLog.create({
          action: EDUCATION_SCHOOL_ACTIONS.RESTORE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATION_SCHOOLS,
          details: JSON.stringify({
            id,
            desc1: education_school.desc1,
            explanation: `Education school with ID : ${id} restored by USER : ${requestInfo?.user_name || ''}`,
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
