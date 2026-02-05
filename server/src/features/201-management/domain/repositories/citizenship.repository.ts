import { PaginatedResult } from '@/core/utils/pagination.util';
import { Citizenship } from '../models/citizenship.model';

export interface CitizenshipRepository<Context = unknown> {
  /** Create a citizenship. */
  create(citizenship: Citizenship, context: Context): Promise<Citizenship>;
  /** Update a citizenship. */
  update(
    id: number,
    dto: Partial<Citizenship>,
    context: Context,
  ): Promise<boolean>;
  /** Find a citizenship by ID. */
  findById(id: number, context: Context): Promise<Citizenship | null>;
  /** Find paginated list of citizenships. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<Citizenship>>;
  /** Get citizenships for combobox/dropdown. */
  combobox(context: Context): Promise<Citizenship[]>;
}
