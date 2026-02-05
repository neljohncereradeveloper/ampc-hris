import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EducationLevelBusinessException } from '@/features/201-management/domain/exceptions';
import { EducationLevelRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_LEVEL_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveEducationLevelUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_LEVEL)
    private readonly educationLevelRepository: EducationLevelRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_LEVEL_ACTIONS.ARCHIVE,
      async (manager) => {
        // Validate existence
        const education_level =
          await this.educationLevelRepository.findById(id, manager);
        if (!education_level) {
          throw new EducationLevelBusinessException(
            `Education level with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Use domain method to archive (soft delete)
        education_level.archive(requestInfo?.user_name || '');

        // Update the entity
        const success = await this.educationLevelRepository.update(
          id,
          education_level,
          manager,
        );
        if (!success) {
          throw new EducationLevelBusinessException(
            'Education level archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the archive
        const log = ActivityLog.create({
          action: EDUCATION_LEVEL_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATION_LEVELS,
          details: JSON.stringify({
            id,
            desc1: education_level.desc1,
            explanation: `Education level with ID : ${id} archived by USER : ${requestInfo?.user_name || ''}`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(education_level.deleted_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
