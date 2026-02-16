import { PaginatedResult } from '@/core/utils/pagination.util';
import { Reference } from '../models/reference.model';

export interface ReferenceRepository<Context = unknown> {
  /** Create a reference. */
  create(reference: Reference, context: Context): Promise<Reference>;
  /** Update a reference. */
  update(
    id: number,
    dto: Partial<Reference>,
    context: Context,
  ): Promise<boolean>;
  /** Find a reference by ID. */
  findById(id: number, context: Context): Promise<Reference | null>;
  /** Find paginated list of references. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    employee_id: number,
    context: Context,
  ): Promise<PaginatedResult<Reference>>;
}
