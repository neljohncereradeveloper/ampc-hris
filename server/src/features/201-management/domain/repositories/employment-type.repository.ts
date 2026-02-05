import { PaginatedResult } from '@/core/utils/pagination.util';
import { EmploymentType } from '../models/employment-type.model';

export interface EmploymentTypeRepository<Context = unknown> {
  /** Create an employment type. */
  create(
    employment_type: EmploymentType,
    context: Context,
  ): Promise<EmploymentType>;
  /** Update an employment type. */
  update(
    id: number,
    dto: Partial<EmploymentType>,
    context: Context,
  ): Promise<boolean>;
  /** Find an employment type by ID. */
  findById(id: number, context: Context): Promise<EmploymentType | null>;
  /** Find an employment type by description. */
  findByDescription(description: string, context: Context): Promise<EmploymentType | null>;
  /** Find paginated list of employment types. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<EmploymentType>>;
  /** Get employment types for combobox/dropdown. */
  combobox(context: Context): Promise<EmploymentType[]>;
}
