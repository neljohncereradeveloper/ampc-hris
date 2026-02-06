import { Module } from '@nestjs/common';
import { PostgresqlDatabaseModule } from '@/core/infrastructure/database/postgresql-database.module';
import { MANAGEMENT_201_TOKENS } from './domain/constants';
import { BarangayRepositoryImpl } from './infrastructure/database/repositories/barangay.repository.impl';
import { CityRepositoryImpl } from './infrastructure/database/repositories/city.repository.impl';
import { CitizenshipRepositoryImpl } from './infrastructure/database/repositories/citizenship.repository.impl';
import { CivilStatusRepositoryImpl } from './infrastructure/database/repositories/civil-status.repository.impl';
import { EmploymentTypeRepositoryImpl } from './infrastructure/database/repositories/employment-type.repository.impl';
import { EmploymentStatusRepositoryImpl } from './infrastructure/database/repositories/employment-status.repository.impl';
import { ProvinceRepositoryImpl } from './infrastructure/database/repositories/province.repository.impl';
import { ReligionRepositoryImpl } from './infrastructure/database/repositories/religion.repository.impl';
import { ReferenceRepositoryImpl } from './infrastructure/database/repositories/reference.repository.impl';
import { TrainingCertificateRepositoryImpl } from './infrastructure/database/repositories/training-certificate.repository.impl';
import { TrainingRepositoryImpl } from './infrastructure/database/repositories/training.repository.impl';
import { WorkExperienceCompanyRepositoryImpl } from './infrastructure/database/repositories/work-experience-company.repository.impl';
import { WorkExperienceJobTitleRepositoryImpl } from './infrastructure/database/repositories/work-experience-jobtitle.repository.impl';
import { WorkExperienceRepositoryImpl } from './infrastructure/database/repositories/work-experience.repository.impl';
import { EducationCourseLevelRepositoryImpl } from './infrastructure/database/repositories/education-course-level.repository.impl';
import { EducationCourseRepositoryImpl } from './infrastructure/database/repositories/education-course.repository.impl';
import { EducationLevelRepositoryImpl } from './infrastructure/database/repositories/education-level.repository.impl';
import { EducationSchoolRepositoryImpl } from './infrastructure/database/repositories/education-school.repository.impl';
import { EducationRepositoryImpl } from './infrastructure/database/repositories/education.repository.impl';
import {
  CreateBarangayUseCase,
  UpdateBarangayUseCase,
  ArchiveBarangayUseCase,
  RestoreBarangayUseCase,
  GetPaginatedBarangayUseCase,
  ComboboxBarangayUseCase,
} from './application/use-cases/barangay';
import {
  CreateCityUseCase,
  UpdateCityUseCase,
  ArchiveCityUseCase,
  RestoreCityUseCase,
  GetPaginatedCityUseCase,
  ComboboxCityUseCase,
} from './application/use-cases/city';
import {
  CreateCitizenshipUseCase,
  UpdateCitizenshipUseCase,
  ArchiveCitizenshipUseCase,
  RestoreCitizenshipUseCase,
  GetPaginatedCitizenshipUseCase,
  ComboboxCitizenshipUseCase,
} from './application/use-cases/citizenship';
import {
  CreateCivilStatusUseCase,
  UpdateCivilStatusUseCase,
  ArchiveCivilStatusUseCase,
  RestoreCivilStatusUseCase,
  GetPaginatedCivilStatusUseCase,
  ComboboxCivilStatusUseCase,
} from './application/use-cases/civil-status';
import {
  CreateEmploymentTypeUseCase,
  UpdateEmploymentTypeUseCase,
  ArchiveEmploymentTypeUseCase,
  RestoreEmploymentTypeUseCase,
  GetPaginatedEmploymentTypeUseCase,
  ComboboxEmploymentTypeUseCase,
} from './application/use-cases/employment-type';
import {
  CreateEmploymentStatusUseCase,
  UpdateEmploymentStatusUseCase,
  ArchiveEmploymentStatusUseCase,
  RestoreEmploymentStatusUseCase,
  GetPaginatedEmploymentStatusUseCase,
  ComboboxEmploymentStatusUseCase,
} from './application/use-cases/employment-status';
import {
  CreateProvinceUseCase,
  UpdateProvinceUseCase,
  ArchiveProvinceUseCase,
  RestoreProvinceUseCase,
  GetPaginatedProvinceUseCase,
  ComboboxProvinceUseCase,
} from './application/use-cases/province';
import {
  CreateReligionUseCase,
  UpdateReligionUseCase,
  ArchiveReligionUseCase,
  RestoreReligionUseCase,
  GetPaginatedReligionUseCase,
  ComboboxReligionUseCase,
} from './application/use-cases/religion';
import {
  CreateReferenceUseCase,
  UpdateReferenceUseCase,
  ArchiveReferenceUseCase,
  RestoreReferenceUseCase,
  GetPaginatedReferenceUseCase,
} from './application/use-cases/reference';
import {
  CreateTrainingCertificateUseCase,
  UpdateTrainingCertificateUseCase,
  ArchiveTrainingCertificateUseCase,
  RestoreTrainingCertificateUseCase,
  GetPaginatedTrainingCertificateUseCase,
  ComboboxTrainingCertificateUseCase,
} from './application/use-cases/training-certificate';
import {
  ArchiveTrainingUseCase,
  CreateTrainingUseCase,
  GetPaginatedTrainingUseCase,
  RestoreTrainingUseCase,
  UpdateTrainingUseCase,
} from './application/use-cases/training';
import {
  CreateWorkExperienceCompanyUseCase,
  UpdateWorkExperienceCompanyUseCase,
  ArchiveWorkExperienceCompanyUseCase,
  RestoreWorkExperienceCompanyUseCase,
  GetPaginatedWorkExperienceCompanyUseCase,
  ComboboxWorkExperienceCompanyUseCase,
} from './application/use-cases/work-experience-company';
import {
  CreateWorkExperienceJobTitleUseCase,
  UpdateWorkExperienceJobTitleUseCase,
  ArchiveWorkExperienceJobTitleUseCase,
  RestoreWorkExperienceJobTitleUseCase,
  GetPaginatedWorkExperienceJobTitleUseCase,
  ComboboxWorkExperienceJobTitleUseCase,
} from './application/use-cases/work-experience-jobtitle';
import {
  CreateWorkExperienceUseCase,
  UpdateWorkExperienceUseCase,
  ArchiveWorkExperienceUseCase,
  RestoreWorkExperienceUseCase,
  GetPaginatedWorkExperienceUseCase,
} from './application/use-cases/work-experience';
import {
  CreateEducationCourseLevelUseCase,
  UpdateEducationCourseLevelUseCase,
  ArchiveEducationCourseLevelUseCase,
  RestoreEducationCourseLevelUseCase,
  GetPaginatedEducationCourseLevelUseCase,
  ComboboxEducationCourseLevelUseCase,
} from './application/use-cases/education-course-level';
import {
  CreateEducationCourseUseCase,
  UpdateEducationCourseUseCase,
  ArchiveEducationCourseUseCase,
  RestoreEducationCourseUseCase,
  GetPaginatedEducationCourseUseCase,
  ComboboxEducationCourseUseCase,
} from './application/use-cases/education-course';
import {
  CreateEducationLevelUseCase,
  UpdateEducationLevelUseCase,
  ArchiveEducationLevelUseCase,
  RestoreEducationLevelUseCase,
  GetPaginatedEducationLevelUseCase,
  ComboboxEducationLevelUseCase,
} from './application/use-cases/education-level';
import {
  CreateEducationSchoolUseCase,
  UpdateEducationSchoolUseCase,
  ArchiveEducationSchoolUseCase,
  RestoreEducationSchoolUseCase,
  GetPaginatedEducationSchoolUseCase,
  ComboboxEducationSchoolUseCase,
} from './application/use-cases/education-school';
import {
  CreateEducationUseCase,
  UpdateEducationUseCase,
  ArchiveEducationUseCase,
  RestoreEducationUseCase,
  FindEmployeesEducationUseCase,
} from './application/use-cases/education';
import {
  BarangayController,
  CityController,
  CitizenshipController,
  CivilStatusController,
  EmploymentTypeController,
  EmploymentStatusController,
  ProvinceController,
  ReligionController,
  ReferenceController,
  TrainingCertificateController,
  TrainingController,
  WorkExperienceCompanyController,
  WorkExperienceJobTitleController,
  EducationCourseLevelController,
  EducationCourseController,
  EducationLevelController,
  EducationSchoolController,
  EducationController,
  WorkExperienceController,
} from './presentation/controllers';
import { TransactionAdapter } from '@/core/infrastructure/database/adapters/transaction-helper.adapter';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepositoryImpl } from '@/core/infrastructure/database/repositories';


@Module({
  imports: [PostgresqlDatabaseModule],
  controllers: [
    BarangayController,
    CityController,
    CitizenshipController,
    CivilStatusController,
    EmploymentTypeController,
    EmploymentStatusController,
    ProvinceController,
    ReligionController,
    ReferenceController,
    TrainingCertificateController,
    TrainingController,
    WorkExperienceCompanyController,
    WorkExperienceJobTitleController,
    WorkExperienceController,
    EducationCourseLevelController,
    EducationCourseController,
    EducationLevelController,
    EducationSchoolController,
    EducationController,
  ],
  providers: [
    // Repository implementation
    {
      provide: MANAGEMENT_201_TOKENS.BARANGAY,
      useClass: BarangayRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.CITY,
      useClass: CityRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.CITIZENSHIP,
      useClass: CitizenshipRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.CIVIL_STATUS,
      useClass: CivilStatusRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.EMPLOYMENT_TYPE,
      useClass: EmploymentTypeRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.EMPLOYMENT_STATUS,
      useClass: EmploymentStatusRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.PROVINCE,
      useClass: ProvinceRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.RELIGION,
      useClass: ReligionRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.REFERENCE,
      useClass: ReferenceRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.TRAINING_CERTIFICATE,
      useClass: TrainingCertificateRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.TRAINING,
      useClass: TrainingRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_COMPANY,
      useClass: WorkExperienceCompanyRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_JOBTITLE,
      useClass: WorkExperienceJobTitleRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.WORK_EXPERIENCE,
      useClass: WorkExperienceRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.EDUCATION_COURSE_LEVEL,
      useClass: EducationCourseLevelRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.EDUCATION_COURSE,
      useClass: EducationCourseRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.EDUCATION_LEVEL,
      useClass: EducationLevelRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.EDUCATION_SCHOOL,
      useClass: EducationSchoolRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.EDUCATION,
      useClass: EducationRepositoryImpl,
    },
    {
      provide: TOKENS_CORE.TRANSACTIONPORT,
      useClass: TransactionAdapter,
    },
    {
      provide: TOKENS_CORE.ACTIVITYLOGS,
      useClass: ActivityLogRepositoryImpl,
    },
    // Use cases
    // Barangay use cases
    CreateBarangayUseCase,
    UpdateBarangayUseCase,
    ArchiveBarangayUseCase,
    RestoreBarangayUseCase,
    GetPaginatedBarangayUseCase,
    ComboboxBarangayUseCase,
    // City use cases
    CreateCityUseCase,
    UpdateCityUseCase,
    ArchiveCityUseCase,
    RestoreCityUseCase,
    GetPaginatedCityUseCase,
    ComboboxCityUseCase,
    // Citizenship use cases
    CreateCitizenshipUseCase,
    UpdateCitizenshipUseCase,
    ArchiveCitizenshipUseCase,
    RestoreCitizenshipUseCase,
    GetPaginatedCitizenshipUseCase,
    ComboboxCitizenshipUseCase,
    // Civil status use cases (no get-by-id)
    CreateCivilStatusUseCase,
    UpdateCivilStatusUseCase,
    ArchiveCivilStatusUseCase,
    RestoreCivilStatusUseCase,
    GetPaginatedCivilStatusUseCase,
    ComboboxCivilStatusUseCase,
    // Employment type use cases (no get-by-id)
    CreateEmploymentTypeUseCase,
    UpdateEmploymentTypeUseCase,
    ArchiveEmploymentTypeUseCase,
    RestoreEmploymentTypeUseCase,
    GetPaginatedEmploymentTypeUseCase,
    ComboboxEmploymentTypeUseCase,
    // Employment status use cases (no get-by-id)
    CreateEmploymentStatusUseCase,
    UpdateEmploymentStatusUseCase,
    ArchiveEmploymentStatusUseCase,
    RestoreEmploymentStatusUseCase,
    GetPaginatedEmploymentStatusUseCase,
    ComboboxEmploymentStatusUseCase,
    // Province use cases (no get-by-id)
    CreateProvinceUseCase,
    UpdateProvinceUseCase,
    ArchiveProvinceUseCase,
    RestoreProvinceUseCase,
    GetPaginatedProvinceUseCase,
    ComboboxProvinceUseCase,
    // Religion use cases (no get-by-id)
    CreateReligionUseCase,
    UpdateReligionUseCase,
    ArchiveReligionUseCase,
    RestoreReligionUseCase,
    GetPaginatedReligionUseCase,
    ComboboxReligionUseCase,
    // Reference use cases (no combobox, no get-by-id)
    CreateReferenceUseCase,
    UpdateReferenceUseCase,
    ArchiveReferenceUseCase,
    RestoreReferenceUseCase,
    GetPaginatedReferenceUseCase,
    // Training certificate use cases (with combobox, no get-by-id)
    CreateTrainingCertificateUseCase,
    UpdateTrainingCertificateUseCase,
    ArchiveTrainingCertificateUseCase,
    RestoreTrainingCertificateUseCase,
    GetPaginatedTrainingCertificateUseCase,
    ComboboxTrainingCertificateUseCase,
    // Training use cases (no combobox, no get-by-id)
    CreateTrainingUseCase,
    UpdateTrainingUseCase,
    ArchiveTrainingUseCase,
    RestoreTrainingUseCase,
    GetPaginatedTrainingUseCase,
    // Work experience company use cases (with combobox, no get-by-id)
    CreateWorkExperienceCompanyUseCase,
    UpdateWorkExperienceCompanyUseCase,
    ArchiveWorkExperienceCompanyUseCase,
    RestoreWorkExperienceCompanyUseCase,
    GetPaginatedWorkExperienceCompanyUseCase,
    ComboboxWorkExperienceCompanyUseCase,
    // Work experience job title use cases (with combobox, no get-by-id)
    CreateWorkExperienceJobTitleUseCase,
    UpdateWorkExperienceJobTitleUseCase,
    ArchiveWorkExperienceJobTitleUseCase,
    RestoreWorkExperienceJobTitleUseCase,
    GetPaginatedWorkExperienceJobTitleUseCase,
    ComboboxWorkExperienceJobTitleUseCase,
    // Work experience use cases (no combobox, no get-by-id)
    CreateWorkExperienceUseCase,
    UpdateWorkExperienceUseCase,
    ArchiveWorkExperienceUseCase,
    RestoreWorkExperienceUseCase,
    GetPaginatedWorkExperienceUseCase,
    // Education course level use cases (with combobox, no get-by-id)
    CreateEducationCourseLevelUseCase,
    UpdateEducationCourseLevelUseCase,
    ArchiveEducationCourseLevelUseCase,
    RestoreEducationCourseLevelUseCase,
    GetPaginatedEducationCourseLevelUseCase,
    ComboboxEducationCourseLevelUseCase,
    // Education course use cases (with combobox, no get-by-id)
    CreateEducationCourseUseCase,
    UpdateEducationCourseUseCase,
    ArchiveEducationCourseUseCase,
    RestoreEducationCourseUseCase,
    GetPaginatedEducationCourseUseCase,
    ComboboxEducationCourseUseCase,
    // Education level use cases (with combobox, no get-by-id)
    CreateEducationLevelUseCase,
    UpdateEducationLevelUseCase,
    ArchiveEducationLevelUseCase,
    RestoreEducationLevelUseCase,
    GetPaginatedEducationLevelUseCase,
    ComboboxEducationLevelUseCase,
    // Education school use cases (with combobox, no get-by-id)
    CreateEducationSchoolUseCase,
    UpdateEducationSchoolUseCase,
    ArchiveEducationSchoolUseCase,
    RestoreEducationSchoolUseCase,
    GetPaginatedEducationSchoolUseCase,
    ComboboxEducationSchoolUseCase,
    // Education use cases (employee education records)
    CreateEducationUseCase,
    UpdateEducationUseCase,
    ArchiveEducationUseCase,
    RestoreEducationUseCase,
    FindEmployeesEducationUseCase,
  ],
  exports: [
    // Barangay use cases
    CreateBarangayUseCase,
    UpdateBarangayUseCase,
    ArchiveBarangayUseCase,
    RestoreBarangayUseCase,
    GetPaginatedBarangayUseCase,
    ComboboxBarangayUseCase,
    // City use cases
    CreateCityUseCase,
    UpdateCityUseCase,
    ArchiveCityUseCase,
    RestoreCityUseCase,
    GetPaginatedCityUseCase,
    ComboboxCityUseCase,
    // Citizenship use cases
    CreateCitizenshipUseCase,
    UpdateCitizenshipUseCase,
    ArchiveCitizenshipUseCase,
    RestoreCitizenshipUseCase,
    GetPaginatedCitizenshipUseCase,
    ComboboxCitizenshipUseCase,
    // Civil status use cases (no get-by-id)
    CreateCivilStatusUseCase,
    UpdateCivilStatusUseCase,
    ArchiveCivilStatusUseCase,
    RestoreCivilStatusUseCase,
    GetPaginatedCivilStatusUseCase,
    ComboboxCivilStatusUseCase,
    // Employment type use cases (no get-by-id)
    CreateEmploymentTypeUseCase,
    UpdateEmploymentTypeUseCase,
    ArchiveEmploymentTypeUseCase,
    RestoreEmploymentTypeUseCase,
    GetPaginatedEmploymentTypeUseCase,
    ComboboxEmploymentTypeUseCase,
    // Employment status use cases (no get-by-id)
    CreateEmploymentStatusUseCase,
    UpdateEmploymentStatusUseCase,
    ArchiveEmploymentStatusUseCase,
    RestoreEmploymentStatusUseCase,
    GetPaginatedEmploymentStatusUseCase,
    ComboboxEmploymentStatusUseCase,
    // Province use cases (no get-by-id)
    CreateProvinceUseCase,
    UpdateProvinceUseCase,
    ArchiveProvinceUseCase,
    RestoreProvinceUseCase,
    GetPaginatedProvinceUseCase,
    ComboboxProvinceUseCase,
    // Religion use cases (no get-by-id)
    CreateReligionUseCase,
    UpdateReligionUseCase,
    ArchiveReligionUseCase,
    RestoreReligionUseCase,
    GetPaginatedReligionUseCase,
    ComboboxReligionUseCase,
    // Reference use cases (no combobox, no get-by-id)
    CreateReferenceUseCase,
    UpdateReferenceUseCase,
    ArchiveReferenceUseCase,
    RestoreReferenceUseCase,
    GetPaginatedReferenceUseCase,
    // Training certificate use cases (with combobox, no get-by-id)
    CreateTrainingCertificateUseCase,
    UpdateTrainingCertificateUseCase,
    ArchiveTrainingCertificateUseCase,
    RestoreTrainingCertificateUseCase,
    GetPaginatedTrainingCertificateUseCase,
    ComboboxTrainingCertificateUseCase,
    // Training use cases (no combobox, no get-by-id)
    CreateTrainingUseCase,
    UpdateTrainingUseCase,
    ArchiveTrainingUseCase,
    RestoreTrainingUseCase,
    GetPaginatedTrainingUseCase,
    // Work experience company use cases (with combobox, no get-by-id)
    CreateWorkExperienceCompanyUseCase,
    UpdateWorkExperienceCompanyUseCase,
    ArchiveWorkExperienceCompanyUseCase,
    RestoreWorkExperienceCompanyUseCase,
    GetPaginatedWorkExperienceCompanyUseCase,
    ComboboxWorkExperienceCompanyUseCase,
    // Work experience job title use cases (with combobox, no get-by-id)
    CreateWorkExperienceJobTitleUseCase,
    UpdateWorkExperienceJobTitleUseCase,
    ArchiveWorkExperienceJobTitleUseCase,
    RestoreWorkExperienceJobTitleUseCase,
    GetPaginatedWorkExperienceJobTitleUseCase,
    ComboboxWorkExperienceJobTitleUseCase,
    // Work experience use cases (no combobox, no get-by-id)
    CreateWorkExperienceUseCase,
    UpdateWorkExperienceUseCase,
    ArchiveWorkExperienceUseCase,
    RestoreWorkExperienceUseCase,
    GetPaginatedWorkExperienceUseCase,
    // Education course level use cases (with combobox, no get-by-id)
    CreateEducationCourseLevelUseCase,
    UpdateEducationCourseLevelUseCase,
    ArchiveEducationCourseLevelUseCase,
    RestoreEducationCourseLevelUseCase,
    GetPaginatedEducationCourseLevelUseCase,
    ComboboxEducationCourseLevelUseCase,
    // Education course use cases (with combobox, no get-by-id)
    CreateEducationCourseUseCase,
    UpdateEducationCourseUseCase,
    ArchiveEducationCourseUseCase,
    RestoreEducationCourseUseCase,
    GetPaginatedEducationCourseUseCase,
    ComboboxEducationCourseUseCase,
    // Education level use cases (with combobox, no get-by-id)
    CreateEducationLevelUseCase,
    UpdateEducationLevelUseCase,
    ArchiveEducationLevelUseCase,
    RestoreEducationLevelUseCase,
    GetPaginatedEducationLevelUseCase,
    ComboboxEducationLevelUseCase,
    // Education school use cases (with combobox, no get-by-id)
    CreateEducationSchoolUseCase,
    UpdateEducationSchoolUseCase,
    ArchiveEducationSchoolUseCase,
    RestoreEducationSchoolUseCase,
    GetPaginatedEducationSchoolUseCase,
    ComboboxEducationSchoolUseCase,
    // Education use cases (employee education records)
    CreateEducationUseCase,
    UpdateEducationUseCase,
    ArchiveEducationUseCase,
    RestoreEducationUseCase,
    FindEmployeesEducationUseCase,
    // Export repository tokens for use in other modules
    MANAGEMENT_201_TOKENS.BARANGAY,
    MANAGEMENT_201_TOKENS.CITY,
    MANAGEMENT_201_TOKENS.CITIZENSHIP,
    MANAGEMENT_201_TOKENS.CIVIL_STATUS,
    MANAGEMENT_201_TOKENS.EMPLOYMENT_TYPE,
    MANAGEMENT_201_TOKENS.EMPLOYMENT_STATUS,
    MANAGEMENT_201_TOKENS.PROVINCE,
    MANAGEMENT_201_TOKENS.RELIGION,
    MANAGEMENT_201_TOKENS.REFERENCE,
    MANAGEMENT_201_TOKENS.TRAINING_CERTIFICATE,
    MANAGEMENT_201_TOKENS.TRAINING,
    MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_COMPANY,
    MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_JOBTITLE,
    MANAGEMENT_201_TOKENS.WORK_EXPERIENCE,
    MANAGEMENT_201_TOKENS.EDUCATION_COURSE_LEVEL,
    MANAGEMENT_201_TOKENS.EDUCATION_COURSE,
    MANAGEMENT_201_TOKENS.EDUCATION_LEVEL,
    MANAGEMENT_201_TOKENS.EDUCATION_SCHOOL,
    MANAGEMENT_201_TOKENS.EDUCATION,
  ],
})
export class Management201Module { }
