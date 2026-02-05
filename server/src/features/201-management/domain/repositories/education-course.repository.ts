import { PaginatedResult } from '@/core/utils/pagination.util';
import { EducationCourse } from '../models/education-course.model';

export interface EducationCourseRepository<Context = unknown> {
  /** Create an education course. */
  create(
    education_course: EducationCourse,
    context: Context,
  ): Promise<EducationCourse>;
  /** Update an education course. */
  update(
    id: number,
    dto: Partial<EducationCourse>,
    context: Context,
  ): Promise<boolean>;
  /** Find an education course by ID. */
  findById(id: number, context: Context): Promise<EducationCourse | null>;
  /** Find an education course by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<EducationCourse | null>;
  /** Find paginated list of education courses. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<EducationCourse>>;
  /** Get education courses for combobox/dropdown. */
  combobox(context: Context): Promise<EducationCourse[]>;
}
