import { LeaveBalance } from '../models/leave-balance.model';

/**
 * Persistence for leave balances (per employee, leave type, year).
 * Process: implementations use Context for transaction/connection; all writes go through create/update/closeBalance/resetBalancesForYear.
 */
export interface LeaveBalanceRepository<Context = unknown> {
  /**
   * Persist a new leave balance.
   * @param leave_balance - Domain model to persist
   * @param context - Transaction or connection (e.g. EntityManager)
   */
  create(leave_balance: LeaveBalance, context: Context): Promise<LeaveBalance>;

  /**
   * Update an existing balance by id with partial fields.
   * @param id - Balance primary key
   * @param dto - Fields to update (partial)
   * @param context - Transaction or connection
   */
  update(
    id: number,
    dto: Partial<LeaveBalance>,
    context: Context,
  ): Promise<boolean>;

  /**
   * Load a single balance by id.
   * @param id - Balance primary key
   * @param context - Transaction or connection
   */
  findById(id: number, context: Context): Promise<LeaveBalance | null>;

  /**
   * Load all balances for an employee in a given year.
   * @param employee_id - Employee primary key
   * @param year - Leave year (e.g. "2025")
   * @param context - Transaction or connection
   */
  loadEmployeeBalancesByYear(
    employee_id: number,
    year: string,
    context: Context,
  ): Promise<LeaveBalance[]>;

  /**
   * Load the balance for an employee, leave type, and year (if any).
   * @param employee_id - Employee primary key
   * @param leave_type_id - Leave type primary key
   * @param year - Leave year (e.g. "2025")
   * @param context - Transaction or connection
   */
  loadEmployeeBalancesByLeaveTypeAndYear(
    employee_id: number,
    leave_type_id: number,
    year: string,
    context: Context,
  ): Promise<LeaveBalance | null>;

  /**
   * Set balance status to CLOSED (e.g. year-end or employee exit).
   * @param id - Balance primary key
   * @param context - Transaction or connection
   */
  closeBalance(id: number, context: Context): Promise<boolean>;

  /**
   * Bulk close OPEN/REOPENED balances for a year (status change only, no amount reset).
   * @param year - Leave year (e.g. "2025")
   * @param context - Transaction or connection
   */
  resetBalancesForYear(year: string, context: Context): Promise<boolean>;
}
