/**
 * Command for updating a work experience
 * Application layer command - simple type definition without validation
 */
export interface UpdateWorkExperienceCommand {
  company_id?: number;
  work_experience_job_title_id?: number;
  years?: string;
}
