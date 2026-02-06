import { Education } from '../models/education.model';

export interface EducationRepository<Context = unknown> {
  create(education: Education, context: Context): Promise<Education>;
  update(
    id: number,
    dto: Partial<Education>,
    context: Context,
  ): Promise<boolean>;
  findById(id: number, context: Context): Promise<Education | null>;
  findEmployeesEducation(
    employee_id: number,
    is_archived: boolean,
    context: Context,
  ): Promise<{ data: Education[] }>;
}
