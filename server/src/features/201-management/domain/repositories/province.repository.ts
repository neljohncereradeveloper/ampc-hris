import { PaginatedResult } from '@/core/utils/pagination.util';
import { Province } from '../models/province.model';

export interface ProvinceRepository<Context = unknown> {
  /** Create a province. */
  create(province: Province, context: Context): Promise<Province>;
  /** Update a province. */
  update(
    id: number,
    dto: Partial<Province>,
    context: Context,
  ): Promise<boolean>;
  /** Find a province by ID. */
  findById(id: number, context: Context): Promise<Province | null>;
  /** Find paginated list of provinces. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<Province>>;
  /** Get provinces for combobox/dropdown. */
  combobox(context: Context): Promise<Province[]>;
}
