import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EducationSchoolBusinessException } from '@/features/test/domain/exceptions';
import { EducationSchoolRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_SCHOOL_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveEducationSchoolUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.EDUCATION_SCHOOL)
    private readonly educationSchoolRepository: EducationSchoolRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_SCHOOL_ACTIONS.ARCHIVE,
      async (manager) => {
        const education_school = await this.educationSchoolRepository.findById(
          id,
          manager,
        );
        if (!education_school) {
          throw new EducationSchoolBusinessException(
            `educationSchool with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        education_school.archive(requestInfo?.user_name || '');

        const success = await this.educationSchoolRepository.update(
          id,
          education_school,
          manager,
        );
        if (!success) {
          throw new EducationSchoolBusinessException(
            'EducationSchool archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EDUCATION_SCHOOL_ACTIONS.ARCHIVE,
          entity: TEST_DATABASE_MODELS.EDUCATION_SCHOOLS,
          details: JSON.stringify({
            id,
            desc1: education_school.desc1,
            explanation: `educationSchool with ID : ${id} archived by USER : ${requestInfo?.user_name || ''}`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(
              education_school.deleted_at || new Date(),
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
