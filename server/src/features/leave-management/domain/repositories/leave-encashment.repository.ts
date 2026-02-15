import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeaveEncashment } from '../models/leave-encashment.model';

/**
 * Persistence for leave encashments (converting leave days to pay).
 * Process: implementations use Context for transaction; create stores PENDING; markAsPaid links to payroll.
 */
export interface LeaveEncashmentRepository<Context = unknown> {
  /**
   * Persist a new leave encashment (status PENDING).
   * @param leave_encashment - Domain model to persist
   * @param context - Transaction or connection
   */
  create(
    leave_encashment: LeaveEncashment,
    context: Context,
  ): Promise<LeaveEncashment>;

  /**
   * Update an existing encashment by id with partial fields.
   * @param id - Encashment primary key
   * @param dto - Fields to update (partial)
   * @param context - Transaction or connection
   */
  update(
    id: number,
    dto: Partial<LeaveEncashment>,
    context: Context,
  ): Promise<boolean>;

  /**
   * Load a single encashment by id.
   * @param id - Encashment primary key
   * @param context - Transaction or connection
   */
  findById(id: number, context: Context): Promise<LeaveEncashment | null>;

  /**
   * List encashments with search, pagination, and archive filter.
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
  ): Promise<PaginatedResult<LeaveEncashment>>;

  /**
   * Load all encashments with status PENDING.
   * @param context - Transaction or connection
   */
  findPending(context: Context): Promise<LeaveEncashment[]>;

  /**
   * Mark encashment as paid and store payroll reference.
   * @param id - Encashment primary key
   * @param payroll_ref - Payroll transaction or reference ID
   * @param context - Transaction or connection
   */
  markAsPaid(
    id: number,
    payroll_ref: string,
    context: Context,
  ): Promise<boolean>;

  /**
   * Load all encashments for an employee.
   * @param employee_id - Employee primary key
   * @param context - Transaction or connection
   */
  findByEmployee(
    employee_id: number,
    context: Context,
  ): Promise<LeaveEncashment[]>;
}
