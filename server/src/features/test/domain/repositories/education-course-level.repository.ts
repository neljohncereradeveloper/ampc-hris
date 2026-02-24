import { PaginatedResult } from '@/core/utils/pagination.util';
import { EducationCourseLevel } from '../models/education-course-level.model';

export interface EducationCourseLevelRepository<Context = unknown> {
  /** Create a educationCourseLevel. */
  create(
    education_course_level: EducationCourseLevel,
    context: Context,
  ): Promise<EducationCourseLevel>;
  /** Update a educationCourseLevel. */
  update(
    id: number,
    dto: Partial<EducationCourseLevel>,
    context: Context,
  ): Promise<boolean>;
  /** Find a educationCourseLevel by ID. */
  findById(id: number, context: Context): Promise<EducationCourseLevel | null>;
  /** Find a educationCourseLevel by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<EducationCourseLevel | null>;
  /** Find paginated list of educationCourseLevel. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<EducationCourseLevel>>;
  /** Get educationCourseLevel for combobox/dropdown. */
  combobox(context: Context): Promise<EducationCourseLevel[]>;
}
