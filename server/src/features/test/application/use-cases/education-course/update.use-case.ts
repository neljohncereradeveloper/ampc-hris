import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EducationCourseBusinessException } from '@/features/test/domain/exceptions';
import { EducationCourse } from '@/features/test/domain/models';
import { EducationCourseRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_COURSE_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { UpdateEducationCourseCommand } from '../../commands/education-course/update-education-course.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateEducationCourseUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.EDUCATION_COURSE)
    private readonly educationCourseRepository: EducationCourseRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateEducationCourseCommand,
    requestInfo?: RequestInfo,
  ): Promise<EducationCourse | null> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_ACTIONS.UPDATE,
      async (manager) => {
        const education_course = await this.educationCourseRepository.findById(
          id,
          manager,
        );
        if (!education_course) {
          throw new EducationCourseBusinessException(
            'EducationCourse not found',
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
          education_course,
          tracking_config,
        );

        education_course.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name,
        });

        const success = await this.educationCourseRepository.update(
          id,
          education_course,
          manager,
        );
        if (!success) {
          throw new EducationCourseBusinessException(
            'EducationCourse update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.educationCourseRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: EDUCATION_COURSE_ACTIONS.UPDATE,
          entity: TEST_DATABASE_MODELS.EDUCATION_COURSES,
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
