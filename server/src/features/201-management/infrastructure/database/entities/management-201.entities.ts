/**
 * 201 Management feature entities
 * Export all entities for this feature
 */

import { BarangayEntity } from './barangay.entity';
import { CityEntity } from './city.entity';

/**
 * Array of 201 Management entities for TypeORM configuration
 */
export const management201Entities = [BarangayEntity, CityEntity];
