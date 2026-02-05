/**
 * 201 Management feature entities
 * Export all entities for this feature
 */

import { BarangayEntity } from './barangay.entity';
import { CityEntity } from './city.entity';
import { CitizenshipEntity } from './citizenship.entity';
import { CivilStatusEntity } from './civil-status.entity';
import { EmploymentTypeEntity } from './employment-type.entity';
import { EmploymentStatusEntity } from './employment-status.entity';
import { ProvinceEntity } from './province.entity';
import { ReligionEntity } from './religion.entity';
import { ReferenceEntity } from './reference.entity';
import { TrainingCertificateEntity } from './training-certificate.entity';
import { TrainingEntity } from './training.entity';
import { WorkExperienceCompanyEntity } from './work-experience-company.entity';
import { WorkExperienceJobTitleEntity } from './work-experience-jobtitle.entity';
import { WorkExperienceEntity } from './work-experience.entity';
import { EducationCourseLevelEntity } from './education-course-level.entity';
import { EducationCourseEntity } from './education-course.entity';
import { EducationLevelEntity } from './education-level.entity';
import { EducationSchoolEntity } from './education-school.entity';

/**
 * Array of 201 Management entities for TypeORM configuration
 */
export const management201Entities = [
  BarangayEntity,
  CityEntity,
  CitizenshipEntity,
  CivilStatusEntity,
  EmploymentTypeEntity,
  EmploymentStatusEntity,
  ProvinceEntity,
  ReligionEntity,
  ReferenceEntity,
  TrainingCertificateEntity,
  TrainingEntity,
  WorkExperienceCompanyEntity,
  WorkExperienceJobTitleEntity,
  WorkExperienceEntity,
  EducationCourseLevelEntity,
  EducationCourseEntity,
  EducationLevelEntity,
  EducationSchoolEntity,
];
