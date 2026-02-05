import { PaginatedResult } from '@/core/utils/pagination.util';
import { WorkExperienceCompany } from '../models/work-experience-company.model';

export interface WorkExperienceCompanyRepository<Context = unknown> {
  /** Create a work experience company. */
  create(
    work_experience_company: WorkExperienceCompany,
    context: Context,
  ): Promise<WorkExperienceCompany>;
  /** Update a work experience company. */
  update(
    id: number,
    dto: Partial<WorkExperienceCompany>,
    context: Context,
  ): Promise<boolean>;
  /** Find a work experience company by ID. */
  findById(id: number, context: Context): Promise<WorkExperienceCompany | null>;
  /** Find a work experience company by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<WorkExperienceCompany | null>;
  /** Find paginated list of work experience companies. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<WorkExperienceCompany>>;
  /** Get work experience companies for combobox/dropdown. */
  combobox(context: Context): Promise<WorkExperienceCompany[]>;
}
