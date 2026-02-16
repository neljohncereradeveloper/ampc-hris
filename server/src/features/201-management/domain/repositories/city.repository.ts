import { PaginatedResult } from '@/core/utils/pagination.util';
import { City } from '../models/city.model';

export interface CityRepository<Context = unknown> {
  /** Create a city. */
  create(city: City, context: Context): Promise<City>;
  /** Update a city. */
  update(id: number, dto: Partial<City>, context: Context): Promise<boolean>;
  /** Find a city by ID. */
  findById(id: number, context: Context): Promise<City | null>;
  /** Find a city by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<City | null>;
  /** Find paginated list of cities. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<City>>;
  /** Get cities for combobox/dropdown. */
  combobox(context: Context): Promise<City[]>;
}
