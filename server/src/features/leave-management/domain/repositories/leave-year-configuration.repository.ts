import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeaveYearConfiguration } from '../models/leave-year-configuration.model';

/**
 * Persistence for leave year configurations (date ranges per year, e.g. Jan 1–Dec 31).
 * Process: implementations use Context for transaction; findActiveForDate resolves which year config applies to a given date.
 */
export interface LeaveYearConfigurationRepository<Context = unknown> {
  /**
   * Persist a new leave year configuration.
   * @param leave_year_configuration - Domain model to persist
   * @param context - Transaction or connection
   */
  create(
    leave_year_configuration: LeaveYearConfiguration,
    context: Context,
  ): Promise<LeaveYearConfiguration>;

  /**
   * Update an existing configuration by id with partial fields.
   * @param id - Configuration primary key
   * @param dto - Fields to update (partial)
   * @param context - Transaction or connection
   */
  update(
    id: number,
    dto: Partial<LeaveYearConfiguration>,
    context: Context,
  ): Promise<boolean>;

  /**
   * Load a single configuration by id.
   * @param id - Configuration primary key
   * @param context - Transaction or connection
   */
  findById(
    id: number,
    context: Context,
  ): Promise<LeaveYearConfiguration | null>;

  /**
   * List configurations with search, pagination, and archive filter.
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
  ): Promise<PaginatedResult<LeaveYearConfiguration>>;

  /**
   * Load the configuration for a given year label (if any).
   * @param year - Leave year (e.g. "2025")
   * @param context - Transaction or connection
   */
  findByYear(
    year: string,
    context: Context,
  ): Promise<LeaveYearConfiguration | null>;

  /**
   * Load the active (non-archived) configuration that contains the given date.
   * @param date - Date to check (within cutoff_start_date..cutoff_end_date)
   * @param context - Transaction or connection
   */
  findActiveForDate(
    date: Date,
    context: Context,
  ): Promise<LeaveYearConfiguration | null>;

  /**
   * Load all configurations (e.g. for dropdown or admin list).
   * @param context - Transaction or connection
   */
  findAll(context: Context): Promise<LeaveYearConfiguration[]>;
}
