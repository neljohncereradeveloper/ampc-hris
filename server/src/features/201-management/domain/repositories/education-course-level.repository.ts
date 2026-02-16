import { PaginatedResult } from '@/core/utils/pagination.util';
import { EducationCourseLevel } from '../models/education-course-level.model';

export interface EducationCourseLevelRepository<Context = unknown> {
  /** Create an education course level. */
  create(
    education_course_level: EducationCourseLevel,
    context: Context,
  ): Promise<EducationCourseLevel>;
  /** Update an education course level. */
  update(
    id: number,
    dto: Partial<EducationCourseLevel>,
    context: Context,
  ): Promise<boolean>;
  /** Find an education course level by ID. */
  findById(id: number, context: Context): Promise<EducationCourseLevel | null>;
  /** Find an education course level by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<EducationCourseLevel | null>;
  /** Find paginated list of education course levels. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<EducationCourseLevel>>;
  /** Get education course levels for combobox/dropdown. */
  combobox(context: Context): Promise<EducationCourseLevel[]>;
}
