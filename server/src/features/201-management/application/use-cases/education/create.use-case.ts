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
import { CreateEducationCommand } from '../../commands/education/create-education.command';

@Injectable()
export class CreateEducationUseCase {
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
    command: CreateEducationCommand,
    requestInfo?: RequestInfo,
  ): Promise<Education> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_ACTIONS.CREATE,
      async (manager) => {
        const new_education = Education.create({
          employee_id: command.employee_id,
          education_school_id: command.education_school_id,
          education_level_id: command.education_level_id,
          education_course_id: command.education_course_id,
          education_course_level_id: command.education_course_level_id,
          school_year: command.school_year,
          created_by: requestInfo?.user_name || null,
        });

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

        if (command.education_course_id) {
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
        }

        if (command.education_course_level_id) {
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
        }

        const created_education = await this.educationRepository.create(
          new_education,
          manager,
        );

        if (!created_education) {
          throw new EducationBusinessException(
            'Education creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EDUCATION_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EDUCATIONS,
          details: JSON.stringify({
            id: created_education.id,
            employee_id: created_education.employee_id,
            education_school_id: created_education.education_school_id,
            education_level_id: created_education.education_level_id,
            school_year: created_education.school_year,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_education.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_education;
      },
    );
  }
}
