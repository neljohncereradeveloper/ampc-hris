import { PaginatedResult } from '@/core/utils/pagination.util';
import { Education } from '../models/education.model';

export interface EducationRepository<Context = unknown> {
  create(education: Education, context: Context): Promise<Education>;
  update(
    id: number,
    dto: Partial<Education>,
    context: Context,
  ): Promise<boolean>;
  findById(id: number, context: Context): Promise<Education | null>;
  /** Find paginated list of educations. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    employee_id: number,
    context: Context,
  ): Promise<PaginatedResult<Education>>;
}
