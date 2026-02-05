/**
 * Shared Domain feature entities
 * Export all entities for shared domain functionality
 */

import { BranchEntity } from './branch.entity';
import { DepartmentEntity } from './department.entity';
import { JobtitleEntity } from './jobtitle.entity';
import { HolidayEntity } from './holiday.entity';
import { EmployeeEntity } from './employee.entity';

/**
 * Array of Shared Domain entities for TypeORM configuration
 */
export const sharedDomainEntities = [
  BranchEntity,
  DepartmentEntity,
  JobtitleEntity,
  HolidayEntity,
  EmployeeEntity,
];
