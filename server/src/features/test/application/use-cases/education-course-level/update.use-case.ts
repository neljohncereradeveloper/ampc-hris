import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EducationCourseLevelBusinessException } from '@/features/test/domain/exceptions';
import { EducationCourseLevel } from '@/features/test/domain/models';
import { EducationCourseLevelRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_COURSE_LEVEL_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { UpdateEducationCourseLevelCommand } from '../../commands/education-course-level/update-education-course-level.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateEducationCourseLevelUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.EDUCATION_COURSE_LEVEL)
    private readonly educationCourseLevelRepository: EducationCourseLevelRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateEducationCourseLevelCommand,
    requestInfo?: RequestInfo,
  ): Promise<EducationCourseLevel | null> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_LEVEL_ACTIONS.UPDATE,
      async (manager) => {
        const education_course_level =
          await this.educationCourseLevelRepository.findById(id, manager);
        if (!education_course_level) {
          throw new EducationCourseLevelBusinessException(
            'EducationCourseLevel not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'desc1' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(
          education_course_level,
          tracking_config,
        );

        education_course_level.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name,
        });

        const success = await this.educationCourseLevelRepository.update(
          id,
          education_course_level,
          manager,
        );
        if (!success) {
          throw new EducationCourseLevelBusinessException(
            'EducationCourseLevel update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result =
          await this.educationCourseLevelRepository.findById(id, manager);
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: EDUCATION_COURSE_LEVEL_ACTIONS.UPDATE,
          entity: TEST_DATABASE_MODELS.EDUCATION_COURSE_LEVELS,
          details: JSON.stringify({
            id: updated_result?.id,
            changed_fields: changed_fields,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(updated_result?.updated_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_result;
      },
    );
  }
}
