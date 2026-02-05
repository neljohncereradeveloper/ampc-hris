import { PaginatedResult } from '@/core/utils/pagination.util';
import { EducationLevel } from '../models/education-level.model';

export interface EducationLevelRepository<Context = unknown> {
  /** Create an education level. */
  create(
    education_level: EducationLevel,
    context: Context,
  ): Promise<EducationLevel>;
  /** Update an education level. */
  update(
    id: number,
    dto: Partial<EducationLevel>,
    context: Context,
  ): Promise<boolean>;
  /** Find an education level by ID. */
  findById(id: number, context: Context): Promise<EducationLevel | null>;
  /** Find an education level by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<EducationLevel | null>;
  /** Find paginated list of education levels. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<EducationLevel>>;
  /** Get education levels for combobox/dropdown. */
  combobox(context: Context): Promise<EducationLevel[]>;
}
