import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EducationSchoolBusinessException } from '@/features/201-management/domain/exceptions';
import { EducationSchool } from '@/features/201-management/domain/models';
import { EducationSchoolRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_SCHOOL_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { CreateEducationSchoolCommand } from '../../commands/education-school/create-education-school.command';

@Injectable()
export class CreateEducationSchoolUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_SCHOOL)
    private readonly educationSchoolRepository: EducationSchoolRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateEducationSchoolCommand,
    requestInfo?: RequestInfo,
  ): Promise<EducationSchool> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_SCHOOL_ACTIONS.CREATE,
      async (manager) => {
        // Create domain model (validates automatically)
        const new_education_school = EducationSchool.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        // Persist the entity
        const created_education_school =
          await this.educationSchoolRepository.create(
            new_education_school,
            manager,
          );

        if (!created_education_school) {
          throw new EducationSchoolBusinessException(
            'Education school creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the creation
        const log = ActivityLog.create({
          action: EDUCATION_SCHOOL_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATION_SCHOOLS,
          details: JSON.stringify({
            id: created_education_school.id,
            desc1: created_education_school.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_education_school.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_education_school;
      },
    );
  }
}
