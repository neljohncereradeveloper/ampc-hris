import { PaginatedResult } from '@/core/utils/pagination.util';
import { EducationCourse } from '../models/education-course.model';

export interface EducationCourseRepository<Context = unknown> {
  /** Create a educationCourse. */
  create(
    education_course: EducationCourse,
    context: Context,
  ): Promise<EducationCourse>;
  /** Update a educationCourse. */
  update(
    id: number,
    dto: Partial<EducationCourse>,
    context: Context,
  ): Promise<boolean>;
  /** Find a educationCourse by ID. */
  findById(id: number, context: Context): Promise<EducationCourse | null>;
  /** Find a educationCourse by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<EducationCourse | null>;
  /** Find paginated list of educationCourse. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<EducationCourse>>;
  /** Get educationCourse for combobox/dropdown. */
  combobox(context: Context): Promise<EducationCourse[]>;
}
