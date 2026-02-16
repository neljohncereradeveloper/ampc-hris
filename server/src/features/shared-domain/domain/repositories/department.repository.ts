import { PaginatedResult } from '@/core/utils/pagination.util';
import { Department } from '../models/department.model';

export interface DepartmentRepository<Context = unknown> {
  /** Create a department. */
  create(department: Department, context: Context): Promise<Department>;
  /** Update a department. */
  update(
    id: number,
    dto: Partial<Department>,
    context: Context,
  ): Promise<boolean>;
  /** Find a department by ID. */
  findById(id: number, context: Context): Promise<Department | null>;
  /** Find a department by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<Department | null>;
  /** Find paginated list of departments. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<Department>>;
  /** Get departments for combobox/dropdown. */
  combobox(context: Context): Promise<Department[]>;
}
