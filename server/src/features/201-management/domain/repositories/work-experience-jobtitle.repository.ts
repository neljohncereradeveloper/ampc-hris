import { PaginatedResult } from '@/core/utils/pagination.util';
import { WorkExperienceJobTitle } from '../models/work-experience-jobtitle.model';

export interface WorkExperienceJobTitleRepository<Context = unknown> {
  /** Create a work experience job title. */
  create(
    work_experience_job_title: WorkExperienceJobTitle,
    context: Context,
  ): Promise<WorkExperienceJobTitle>;
  /** Update a work experience job title. */
  update(
    id: number,
    dto: Partial<WorkExperienceJobTitle>,
    context: Context,
  ): Promise<boolean>;
  /** Find a work experience job title by ID. */
  findById(
    id: number,
    context: Context,
  ): Promise<WorkExperienceJobTitle | null>;
  /** Find a work experience job title by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<WorkExperienceJobTitle | null>;
  /** Find paginated list of work experience job titles. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<WorkExperienceJobTitle>>;
  /** Get work experience job titles for combobox/dropdown. */
  combobox(context: Context): Promise<WorkExperienceJobTitle[]>;
}
