import { PaginatedResult } from '@/core/utils/pagination.util';
import { EmploymentStatus } from '../models/employment-status.model';

export interface EmploymentStatusRepository<Context = unknown> {
  /** Create an employment status. */
  create(
    employment_status: EmploymentStatus,
    context: Context,
  ): Promise<EmploymentStatus>;
  /** Update an employment status. */
  update(
    id: number,
    dto: Partial<EmploymentStatus>,
    context: Context,
  ): Promise<boolean>;
  /** Find an employment status by ID. */
  findById(id: number, context: Context): Promise<EmploymentStatus | null>;
  /** Find an employment status by description. */
  findByDescription(description: string, context: Context): Promise<EmploymentStatus | null>;
  /** Find paginated list of employment statuses. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<EmploymentStatus>>;
  /** Get employment statuses for combobox/dropdown. */
  combobox(context: Context): Promise<EmploymentStatus[]>;
}
