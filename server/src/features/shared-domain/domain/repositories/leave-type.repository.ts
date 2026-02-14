import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeaveType } from '../models/leave-type.model';

export interface LeaveTypeRepository<Context = unknown> {
  /** Create a leave type. */
  create(leave_type: LeaveType, context: Context): Promise<LeaveType>;
  /** Update a leave type. */
  update(
    id: number,
    dto: Partial<LeaveType>,
    context: Context,
  ): Promise<boolean>;
  /** Find a leave type by ID. */
  findById(id: number, context: Context): Promise<LeaveType | null>;
  /** Find a leave type by name. */
  findByName(name: string, context: Context): Promise<LeaveType | null>;
  /** Find a leave type by code. */
  findByCode(code: string, context: Context): Promise<LeaveType | null>;
  /** Find a leave type by description (desc1). */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<LeaveType | null>;
  /** Find paginated list of leave types. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<LeaveType>>;
  /** Get leave types for combobox/dropdown. */
  combobox(context: Context): Promise<LeaveType[]>;
}
