import { PaginatedResult } from '@/core/utils/pagination.util';
import { EducationSchool } from '../models/education-school.model';

export interface EducationSchoolRepository<Context = unknown> {
  /** Create a educationSchool. */
  create(
    education_school: EducationSchool,
    context: Context,
  ): Promise<EducationSchool>;
  /** Update a educationSchool. */
  update(
    id: number,
    dto: Partial<EducationSchool>,
    context: Context,
  ): Promise<boolean>;
  /** Find a educationSchool by ID. */
  findById(id: number, context: Context): Promise<EducationSchool | null>;
  /** Find a educationSchool by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<EducationSchool | null>;
  /** Find paginated list of educationSchool. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<EducationSchool>>;
  /** Get educationSchool for combobox/dropdown. */
  combobox(context: Context): Promise<EducationSchool[]>;
}
