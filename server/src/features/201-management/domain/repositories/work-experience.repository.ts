import { PaginatedResult } from '@/core/utils/pagination.util';
import { WorkExperience } from '../models/work-experience.model';

export interface WorkExperienceRepository<Context = unknown> {
  /** Create a work experience. */
  create(
    work_experience: WorkExperience,
    context: Context,
  ): Promise<WorkExperience>;
  /** Update a work experience. */
  update(
    id: number,
    dto: Partial<WorkExperience>,
    context: Context,
  ): Promise<boolean>;
  /** Find a work experience by ID. */
  findById(id: number, context: Context): Promise<WorkExperience | null>;
  /** Find work experiences by employee ID. */
  findByEmployeeId(
    employee_id: number,
    context: Context,
  ): Promise<WorkExperience[]>;
  /** Find paginated list of work experiences. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    employee_id: number | null,
    context: Context,
  ): Promise<PaginatedResult<WorkExperience>>;
}
