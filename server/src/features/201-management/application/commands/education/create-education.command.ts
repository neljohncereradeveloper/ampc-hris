/**
 * Command for creating an education record
 */
export interface CreateEducationCommand {
  employee_id: number;
  education_school_id: number;
  education_level_id: number;
  education_course_id?: number;
  education_course_level_id?: number;
  school_year: string;
}
