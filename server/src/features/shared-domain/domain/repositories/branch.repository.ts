import { PaginatedResult } from '@/core/utils/pagination.util';
import { Branch } from '../models/branch.model';

export interface BranchRepository<Context = unknown> {
  /** Create a branch. */
  create(branch: Branch, context: Context): Promise<Branch>;
  /** Update a branch. */
  update(
    id: number,
    dto: Partial<Branch>,
    context: Context,
  ): Promise<boolean>;
  /** Find a branch by ID. */
  findById(id: number, context: Context): Promise<Branch | null>;
  /** Find a branch by description. */
  findByDescription(description: string, context: Context): Promise<Branch | null>;
  /** Find paginated list of branches. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<Branch>>;
  /** Get branches for combobox/dropdown. */
  combobox(context: Context): Promise<Branch[]>;
}
