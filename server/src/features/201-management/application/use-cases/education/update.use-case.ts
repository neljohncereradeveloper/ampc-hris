import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EducationBusinessException } from '@/features/201-management/domain/exceptions';
import { Education } from '@/features/201-management/domain/models';
import {
  EducationRepository,
  EducationSchoolRepository,
  EducationLevelRepository,
  EducationCourseRepository,
  EducationCourseLevelRepository,
} from '@/features/201-management/domain/repositories';
import {
  EDUCATION_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { UpdateEducationCommand } from '../../commands/education/update-education.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateEducationUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION)
    private readonly educationRepository: EducationRepository,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_SCHOOL)
    private readonly educationSchoolRepository: EducationSchoolRepository,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_LEVEL)
    private readonly educationLevelRepository: EducationLevelRepository,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_COURSE)
    private readonly educationCourseRepository: EducationCourseRepository,
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_COURSE_LEVEL)
    private readonly educationCourseLevelRepository: EducationCourseLevelRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateEducationCommand,
    requestInfo?: RequestInfo,
  ): Promise<Education | null> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_ACTIONS.UPDATE,
      async (manager) => {
        const education = await this.educationRepository.findById(id, manager);
        if (!education) {
          throw new EducationBusinessException(
            'Education record not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        if (command.education_school_id !== undefined) {
          const school = await this.educationSchoolRepository.findById(
            command.education_school_id,
            manager,
          );
          if (!school) {
            throw new EducationBusinessException(
              `Education school with ID ${command.education_school_id} not found.`,
              HTTP_STATUS.NOT_FOUND,
            );
          }
          education.education_school_id = command.education_school_id;
        }

        if (command.education_level_id !== undefined) {
          const level = await this.educationLevelRepository.findById(
            command.education_level_id,
            manager,
          );
          if (!level) {
            throw new EducationBusinessException(
              `Education level with ID ${command.education_level_id} not found.`,
              HTTP_STATUS.NOT_FOUND,
            );
          }
          education.education_level_id = command.education_level_id;
        }

        if (command.education_course_id !== undefined) {
          if (command.education_course_id === null) {
            education.education_course_id = undefined;
          } else {
            const course = await this.educationCourseRepository.findById(
              command.education_course_id,
              manager,
            );
            if (!course) {
              throw new EducationBusinessException(
                `Education course with ID ${command.education_course_id} not found.`,
                HTTP_STATUS.NOT_FOUND,
              );
            }
            education.education_course_id = command.education_course_id;
          }
        }

        if (command.education_course_level_id !== undefined) {
          if (command.education_course_level_id === null) {
            education.education_course_level_id = undefined;
          } else {
            const courseLevel =
              await this.educationCourseLevelRepository.findById(
                command.education_course_level_id,
                manager,
              );
            if (!courseLevel) {
              throw new EducationBusinessException(
                `Education course level with ID ${command.education_course_level_id} not found.`,
                HTTP_STATUS.NOT_FOUND,
              );
            }
            education.education_course_level_id =
              command.education_course_level_id;
          }
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'education_school_id' },
          { field: 'education_level_id' },
          { field: 'education_course_id' },
          { field: 'education_course_level_id' },
          { field: 'school_year' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const originalState = extractEntityState(education, tracking_config);

        education.update({
          education_school_id:
            command.education_school_id ?? education.education_school_id,
          education_level_id:
            command.education_level_id ?? education.education_level_id,
          education_course_id:
            command.education_course_id === undefined
              ? education.education_course_id
              : (command.education_course_id ?? undefined),
          education_course_level_id:
            command.education_course_level_id === undefined
              ? education.education_course_level_id
              : (command.education_course_level_id ?? undefined),
          school_year: command.school_year ?? education.school_year,
          updated_by: requestInfo?.user_name || null,
        });

        const success = await this.educationRepository.update(
          id,
          education,
          manager,
        );
        if (!success) {
          throw new EducationBusinessException(
            'Education update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.educationRepository.findById(
          id,
          manager,
        );
        const newState = extractEntityState(updated_result, tracking_config);
        const changedFields = getChangedFields(originalState, newState);

        const log = ActivityLog.create({
          action: EDUCATION_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATIONS,
          details: JSON.stringify({
            id,
            changed_fields: changedFields,
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
