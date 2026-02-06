/**
 * Command for updating an education record
 */
export interface UpdateEducationCommand {
  education_school_id?: number;
  education_level_id?: number;
  education_course_id?: number | null;
  education_course_level_id?: number | null;
  school_year?: string;
}
