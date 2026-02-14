import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeaveRequest } from '../models/leave-request.model';

export interface LeaveRequestRepository<Context = unknown> {
  create(leave_request: LeaveRequest, context: Context): Promise<LeaveRequest>;
  update(
    id: number,
    dto: Partial<LeaveRequest>,
    context: Context,
  ): Promise<boolean>;
  findById(id: number, context: Context): Promise<LeaveRequest | null>;
  findByEmployee(
    employee_id: number,
    context: Context,
  ): Promise<LeaveRequest[]>;
  findPending(context: Context): Promise<LeaveRequest[]>;
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<LeaveRequest>>;
  updateStatus(
    id: number,
    status: string,
    approver_id: number | undefined,
    remarks: string,
    context: Context,
  ): Promise<boolean>;
  findOverlappingRequests(
    employee_id: number,
    start_date: Date,
    end_date: Date,
    context: Context,
    exclude_id: number | undefined,
  ): Promise<LeaveRequest[]>;
}
