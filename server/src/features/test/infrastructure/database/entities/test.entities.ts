/**
 * Test feature entities
 * Export all entities for test functionality
 */

import { TestOneEntity } from './test-one.entity';
import { TestTwoEntity } from './test-two.entity';
import { TestThreeEntity } from './test-three.entity';
// PLOP-APPEND-IMPORTS

/**
 * Array of Test entities for TypeORM configuration
 */
export const testEntities = [
  TestOneEntity,
  TestTwoEntity,
  TestThreeEntity,
  // PLOP-APPEND-ARRAY
];
