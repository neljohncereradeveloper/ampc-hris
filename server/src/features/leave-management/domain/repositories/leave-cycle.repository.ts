import { LeaveCycle } from '../models/leave-cycle.model';

/**
 * Persistence for leave cycles (employee + leave type over a year range, e.g. for carry-over logic).
 * Process: implementations use Context for transaction; getActiveCycle returns current cycle; closeCycle marks cycle as closed.
 */
export interface LeaveCycleRepository<Context = unknown> {
  /**
   * Persist a new leave cycle.
   * @param leave_cycle - Domain model to persist
   * @param context - Transaction or connection
   */
  create(leave_cycle: LeaveCycle, context: Context): Promise<LeaveCycle>;

  /**
   * Update an existing cycle by id with partial fields.
   * @param id - Cycle primary key
   * @param dto - Fields to update (partial)
   * @param context - Transaction or connection
   */
  update(
    id: number,
    dto: Partial<LeaveCycle>,
    context: Context,
  ): Promise<boolean>;

  /**
   * Load a single cycle by id.
   * @param id - Cycle primary key
   * @param context - Transaction or connection
   */
  findById(id: number, context: Context): Promise<LeaveCycle | null>;

  /**
   * Load all cycles for an employee.
   * @param employee_id - Employee primary key
   * @param context - Transaction or connection
   */
  findByEmployee(employee_id: number, context: Context): Promise<LeaveCycle[]>;

  /**
   * Load the active cycle for an employee and leave type (if any).
   * @param employee_id - Employee primary key
   * @param leave_type_id - Leave type primary key
   * @param context - Transaction or connection
   */
  getActiveCycle(
    employee_id: number,
    leave_type_id: number,
    context: Context,
  ): Promise<LeaveCycle | null>;

  /**
   * Find a cycle that overlaps the given year range (for conflict checks).
   * @param employee_id - Employee primary key
   * @param leave_type_id - Leave type primary key
   * @param cycle_start_year - Range start year
   * @param cycle_end_year - Range end year
   * @param context - Transaction or connection
   */
  findOverlappingCycle(
    employee_id: number,
    leave_type_id: number,
    cycle_start_year: number,
    cycle_end_year: number,
    context: Context,
  ): Promise<LeaveCycle | null>;

  /**
   * Mark a cycle as closed.
   * @param id - Cycle primary key
   * @param context - Transaction or connection
   */
  closeCycle(id: number, context: Context): Promise<boolean>;
}
