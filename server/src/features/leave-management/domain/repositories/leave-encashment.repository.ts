import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeaveEncashment } from '../models/leave-encashment.model';

export interface LeaveEncashmentRepository<Context = unknown> {
  create(
    leave_encashment: LeaveEncashment,
    context: Context,
  ): Promise<LeaveEncashment>;
  update(
    id: number,
    dto: Partial<LeaveEncashment>,
    context: Context,
  ): Promise<boolean>;
  findById(id: number, context: Context): Promise<LeaveEncashment | null>;
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<LeaveEncashment>>;
  findPending(context: Context): Promise<LeaveEncashment[]>;
  markAsPaid(
    id: number,
    payroll_ref: string,
    context: Context,
  ): Promise<boolean>;
  findByEmployee(
    employee_id: number,
    context: Context,
  ): Promise<LeaveEncashment[]>;
}
