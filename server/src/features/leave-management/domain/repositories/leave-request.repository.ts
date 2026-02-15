import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeaveRequest } from '../models/leave-request.model';

/**
 * Persistence for leave requests (employee leave applications).
 * Process: implementations use Context for transaction; create/update/updateStatus modify state; findOverlappingRequests prevents double-booking.
 */
export interface LeaveRequestRepository<Context = unknown> {
  /**
   * Persist a new leave request (status PENDING).
   * @param leave_request - Domain model to persist
   * @param context - Transaction or connection
   */
  create(leave_request: LeaveRequest, context: Context): Promise<LeaveRequest>;

  /**
   * Update an existing request by id with partial fields (only when PENDING).
   * @param id - Request primary key
   * @param dto - Fields to update (partial)
   * @param context - Transaction or connection
   */
  update(
    id: number,
    dto: Partial<LeaveRequest>,
    context: Context,
  ): Promise<boolean>;

  /**
   * Load a single leave request by id.
   * @param id - Request primary key
   * @param context - Transaction or connection
   */
  findById(id: number, context: Context): Promise<LeaveRequest | null>;

  /**
   * Load all leave requests for an employee.
   * @param employee_id - Employee primary key
   * @param context - Transaction or connection
   */
  findByEmployee(
    employee_id: number,
    context: Context,
  ): Promise<LeaveRequest[]>;

  /**
   * Load all leave requests with status PENDING.
   * @param context - Transaction or connection
   */
  findPending(context: Context): Promise<LeaveRequest[]>;

  /**
   * List leave requests with search, pagination, and archive filter.
   * @param term - Search term
   * @param page - Page number (1-based)
   * @param limit - Page size
   * @param is_archived - If true, only archived; if false, exclude archived
   * @param context - Transaction or connection
   */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<LeaveRequest>>;

  /**
   * Set request status and approver (e.g. APPROVED, REJECTED, CANCELLED).
   * @param id - Request primary key
   * @param status - New status value
   * @param approver_id - User who approved/rejected (optional)
   * @param remarks - Optional remarks
   * @param context - Transaction or connection
   */
  updateStatus(
    id: number,
    status: string,
    approver_id: number | undefined,
    remarks: string,
    context: Context,
  ): Promise<boolean>;

  /**
   * Find requests that overlap the given date range for an employee (for conflict checks).
   * @param employee_id - Employee primary key
   * @param start_date - Range start
   * @param end_date - Range end
   * @param context - Transaction or connection
   * @param exclude_id - Request id to exclude from results (e.g. when updating)
   */
  findOverlappingRequests(
    employee_id: number,
    start_date: Date,
    end_date: Date,
    context: Context,
    exclude_id: number | undefined,
  ): Promise<LeaveRequest[]>;
}
