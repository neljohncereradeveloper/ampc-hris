import { Module } from '@nestjs/common';
import { PostgresqlDatabaseModule } from '@/core/infrastructure/database/postgresql-database.module';
import { TransactionAdapter } from '@/core/infrastructure/database/adapters/transaction-helper.adapter';
import { ActivityLogRepositoryImpl } from '@/core/infrastructure/database/repositories';
import { TOKENS_CORE } from '@/core/domain/constants';

import { TEST_TOKENS } from './domain/constants';
import { SharedDomainModule } from '@/features/shared-domain/shared-domain.module';

import * as TestRepositories from './infrastructure/database/repositories';
import * as TestControllers from './presentation/controllers';

import * as EducationCourseLevelUseCases from './application/use-cases/education-course-level';
import * as EducationCourseUseCases from './application/use-cases/education-course';
import * as EducationLevelUseCases from './application/use-cases/education-level';
import * as EducationSchoolUseCases from './application/use-cases/education-school';
// PLOP-IMPORT-USECASES

/**
 * =========================
 * USE CASES
 * =========================
 */

const educationCourseLevelUseCaseList = [
  EducationCourseLevelUseCases.CreateEducationCourseLevelUseCase,
  EducationCourseLevelUseCases.UpdateEducationCourseLevelUseCase,
  EducationCourseLevelUseCases.ArchiveEducationCourseLevelUseCase,
  EducationCourseLevelUseCases.RestoreEducationCourseLevelUseCase,
  EducationCourseLevelUseCases.GetPaginatedEducationCourseLevelUseCase,
  EducationCourseLevelUseCases.ComboboxEducationCourseLevelUseCase,
];

const educationCourseUseCaseList = [
  EducationCourseUseCases.CreateEducationCourseUseCase,
  EducationCourseUseCases.UpdateEducationCourseUseCase,
  EducationCourseUseCases.ArchiveEducationCourseUseCase,
  EducationCourseUseCases.RestoreEducationCourseUseCase,
  EducationCourseUseCases.GetPaginatedEducationCourseUseCase,
  EducationCourseUseCases.ComboboxEducationCourseUseCase,
];

const educationLevelUseCaseList = [
  EducationLevelUseCases.CreateEducationLevelUseCase,
  EducationLevelUseCases.UpdateEducationLevelUseCase,
  EducationLevelUseCases.ArchiveEducationLevelUseCase,
  EducationLevelUseCases.RestoreEducationLevelUseCase,
  EducationLevelUseCases.GetPaginatedEducationLevelUseCase,
  EducationLevelUseCases.ComboboxEducationLevelUseCase,
];

const educationSchoolUseCaseList = [
  EducationSchoolUseCases.CreateEducationSchoolUseCase,
  EducationSchoolUseCases.UpdateEducationSchoolUseCase,
  EducationSchoolUseCases.ArchiveEducationSchoolUseCase,
  EducationSchoolUseCases.RestoreEducationSchoolUseCase,
  EducationSchoolUseCases.GetPaginatedEducationSchoolUseCase,
  EducationSchoolUseCases.ComboboxEducationSchoolUseCase,
];

// PLOP-DECLARE-USECASE-LISTS

@Module({
  imports: [PostgresqlDatabaseModule, SharedDomainModule],
  controllers: [
    TestControllers.EducationCourseLevelController,
    TestControllers.EducationCourseController,
    TestControllers.EducationLevelController,
    TestControllers.EducationSchoolController,
    // PLOP-CONTROLLERS
  ],
  providers: [
    {
      provide: TOKENS_CORE.TRANSACTIONPORT,
      useClass: TransactionAdapter,
    },
    {
      provide: TOKENS_CORE.ACTIVITYLOGS,
      useClass: ActivityLogRepositoryImpl,
    },

    {
      provide: TEST_TOKENS.EDUCATION_COURSE_LEVEL,
      useClass: TestRepositories.EducationCourseLevelRepositoryImpl,
    },

    {
      provide: TEST_TOKENS.EDUCATION_COURSE,
      useClass: TestRepositories.EducationCourseRepositoryImpl,
    },

    {
      provide: TEST_TOKENS.EDUCATION_LEVEL,
      useClass: TestRepositories.EducationLevelRepositoryImpl,
    },

    {
      provide: TEST_TOKENS.EDUCATION_SCHOOL,
      useClass: TestRepositories.EducationSchoolRepositoryImpl,
    },
    // PLOP-PROVIDERS

    ...educationCourseLevelUseCaseList, // providers
    ...educationCourseUseCaseList, // providers
    ...educationLevelUseCaseList, // providers
    ...educationSchoolUseCaseList, // providers
    // PLOP-USECASE-SPREAD
  ],
  exports: [
    TEST_TOKENS.EDUCATION_COURSE_LEVEL, // exports
    TEST_TOKENS.EDUCATION_COURSE, // exports
    TEST_TOKENS.EDUCATION_LEVEL, // exports
    TEST_TOKENS.EDUCATION_SCHOOL, // exports
    // PLOP-EXPORTS
    ...educationCourseLevelUseCaseList, // export-spread
    ...educationCourseUseCaseList, // export-spread
    ...educationLevelUseCaseList, // export-spread
    ...educationSchoolUseCaseList, // export-spread
    // PLOP-EXPORT-USECASE-SPREAD
  ],
})
export class TestModule {}
