import { PaginatedResult } from '@/core/utils/pagination.util';
import { EducationSchool } from '../models/education-school.model';

export interface EducationSchoolRepository<Context = unknown> {
  /** Create an education school. */
  create(
    education_school: EducationSchool,
    context: Context,
  ): Promise<EducationSchool>;
  /** Update an education school. */
  update(
    id: number,
    dto: Partial<EducationSchool>,
    context: Context,
  ): Promise<boolean>;
  /** Find an education school by ID. */
  findById(id: number, context: Context): Promise<EducationSchool | null>;
  /** Find an education school by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<EducationSchool | null>;
  /** Find paginated list of education schools. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<EducationSchool>>;
  /** Get education schools for combobox/dropdown. */
  combobox(context: Context): Promise<EducationSchool[]>;
}
