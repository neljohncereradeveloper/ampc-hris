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
];
