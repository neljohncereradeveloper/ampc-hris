import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EducationCourseLevelBusinessException } from '@/features/201-management/domain/exceptions';
import { EducationCourseLevel } from '@/features/201-management/domain/models';
import { EducationCourseLevelRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_COURSE_LEVEL_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { CreateEducationCourseLevelCommand } from '../../commands/education-course-level/create-education-course-level.command';

@Injectable()
export class CreateEducationCourseLevelUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_COURSE_LEVEL)
    private readonly educationCourseLevelRepository: EducationCourseLevelRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateEducationCourseLevelCommand,
    requestInfo?: RequestInfo,
  ): Promise<EducationCourseLevel> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_LEVEL_ACTIONS.CREATE,
      async (manager) => {
        // Create domain model (validates automatically)
        const new_education_course_level = EducationCourseLevel.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        // Persist the entity
        const created_education_course_level =
          await this.educationCourseLevelRepository.create(
            new_education_course_level,
            manager,
          );

        if (!created_education_course_level) {
          throw new EducationCourseLevelBusinessException(
            'Education course level creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the creation
        const log = ActivityLog.create({
          action: EDUCATION_COURSE_LEVEL_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATION_COURSE_LEVELS,
          details: JSON.stringify({
            id: created_education_course_level.id,
            desc1: created_education_course_level.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(
              created_education_course_level.created_at,
            ),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_education_course_level;
      },
    );
  }
}
