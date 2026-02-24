import { PaginatedResult } from '@/core/utils/pagination.util';
import { EducationLevel } from '../models/education-level.model';

export interface EducationLevelRepository<Context = unknown> {
  /** Create a educationLevel. */
  create(
    education_level: EducationLevel,
    context: Context,
  ): Promise<EducationLevel>;
  /** Update a educationLevel. */
  update(
    id: number,
    dto: Partial<EducationLevel>,
    context: Context,
  ): Promise<boolean>;
  /** Find a educationLevel by ID. */
  findById(id: number, context: Context): Promise<EducationLevel | null>;
  /** Find a educationLevel by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<EducationLevel | null>;
  /** Find paginated list of educationLevel. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<EducationLevel>>;
  /** Get educationLevel for combobox/dropdown. */
  combobox(context: Context): Promise<EducationLevel[]>;
}
