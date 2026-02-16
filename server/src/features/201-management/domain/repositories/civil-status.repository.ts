import { PaginatedResult } from '@/core/utils/pagination.util';
import { CivilStatus } from '../models/civil-status.model';

export interface CivilStatusRepository<Context = unknown> {
  /** Create a civil status. */
  create(civil_status: CivilStatus, context: Context): Promise<CivilStatus>;
  /** Update a civil status. */
  update(
    id: number,
    dto: Partial<CivilStatus>,
    context: Context,
  ): Promise<boolean>;
  /** Find a civil status by ID. */
  findById(id: number, context: Context): Promise<CivilStatus | null>;
  /** Find a civil status by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<CivilStatus | null>;
  /** Find paginated list of civil statuses. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<CivilStatus>>;
  /** Get civil statuses for combobox/dropdown. */
  combobox(context: Context): Promise<CivilStatus[]>;
}
