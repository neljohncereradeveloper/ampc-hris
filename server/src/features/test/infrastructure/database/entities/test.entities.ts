/**
 * Test feature entities
 * Export all entities for test functionality
 */

import { EducationCourseLevelEntity } from './education-course-level.entity';
import { EducationCourseEntity } from './education-course.entity';
import { EducationLevelEntity } from './education-level.entity';
import { EducationSchoolEntity } from './education-school.entity';
// PLOP-APPEND-IMPORTS

/**
 * Array of Test entities for TypeORM configuration
 */
export const testEntities = [
  EducationCourseLevelEntity,
  EducationCourseEntity,
  EducationLevelEntity,
  EducationSchoolEntity,
  // PLOP-APPEND-ARRAY
];
