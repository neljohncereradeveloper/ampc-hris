/**
 * Command for creating a work experience
 * Application layer command - simple type definition without validation
 */
export interface CreateWorkExperienceCommand {
  employee_id?: number;
  company_id?: number;
  work_experience_job_title_id?: number;
  years?: string;
}
