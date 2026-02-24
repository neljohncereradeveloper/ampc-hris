import { PaginatedResult } from '@/core/utils/pagination.util';
import { CivilStatus } from '../models/civil-status.model';

export interface CivilStatusRepository<Context = unknown> {
  /** Create a civilStatus. */
  create(civil_status: CivilStatus, context: Context): Promise<CivilStatus>;
  /** Update a civilStatus. */
  update(
    id: number,
    dto: Partial<CivilStatus>,
    context: Context,
  ): Promise<boolean>;
  /** Find a civilStatus by ID. */
  findById(id: number, context: Context): Promise<CivilStatus | null>;
  /** Find a civilStatus by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<CivilStatus | null>;
  /** Find paginated list of civilStatus. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<CivilStatus>>;
  /** Get civilStatus for combobox/dropdown. */
  combobox(context: Context): Promise<CivilStatus[]>;
}
