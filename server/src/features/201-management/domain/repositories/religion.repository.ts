import { PaginatedResult } from '@/core/utils/pagination.util';
import { Religion } from '../models/religion.model';

export interface ReligionRepository<Context = unknown> {
  /** Create a religion. */
  create(religion: Religion, context: Context): Promise<Religion>;
  /** Update a religion. */
  update(
    id: number,
    dto: Partial<Religion>,
    context: Context,
  ): Promise<boolean>;
  /** Find a religion by ID. */
  findById(id: number, context: Context): Promise<Religion | null>;
  /** Find paginated list of religions. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<Religion>>;
  /** Get religions for combobox/dropdown. */
  combobox(context: Context): Promise<Religion[]>;
}
