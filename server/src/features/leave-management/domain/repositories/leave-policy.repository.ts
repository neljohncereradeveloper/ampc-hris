import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeavePolicy } from '../models/leave-policy.model';

/**
 * Persistence for leave policies (one active per leave type).
 * Process: implementations use Context for transaction; activate/retire enforce one-active-per-leave-type at DB level.
 */
export interface LeavePolicyRepository<Context = unknown> {
  /**
   * Persist a new leave policy (typically DRAFT).
   * @param leave_policy - Domain model to persist
   * @param context - Transaction or connection
   */
  create(leave_policy: LeavePolicy, context: Context): Promise<LeavePolicy>;

  /**
   * Update an existing policy by id with partial fields.
   * @param id - Policy primary key
   * @param dto - Fields to update (partial)
   * @param context - Transaction or connection
   */
  update(
    id: number,
    dto: Partial<LeavePolicy>,
    context: Context,
  ): Promise<boolean>;

  /**
   * Load a single policy by id.
   * @param id - Policy primary key
   * @param context - Transaction or connection
   */
  findById(id: number, context: Context): Promise<LeavePolicy | null>;

  /**
   * List policies with search, pagination, and archive filter.
   * @param term - Search term (e.g. leave type name)
   * @param page - Page number (1-based)
   * @param limit - Page size
   * @param is_archived - If true, return only archived; if false, exclude archived
   * @param context - Transaction or connection
   */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<LeavePolicy>>;

  /**
   * Load all policies with status ACTIVE (for dropdowns, bulk generation).
   * @param context - Transaction or connection
   */
  retrieveActivePolicies(context: Context): Promise<LeavePolicy[]>;

  /**
   * Load the current ACTIVE policy for a leave type (if any).
   * @param leave_type_id - Leave type primary key
   * @param context - Transaction or connection
   */
  getActivePolicy(
    leave_type_id: number,
    context: Context,
  ): Promise<LeavePolicy | null>;

  /**
   * Set policy status to ACTIVE (caller must retire existing active for same leave type first).
   * @param id - Policy primary key
   * @param context - Transaction or connection
   */
  activatePolicy(id: number, context: Context): Promise<boolean>;

  /**
   * Set policy status to RETIRED and optionally set expiry_date.
   * @param id - Policy primary key
   * @param context - Transaction or connection
   * @param expiry_date - Optional end date for the policy
   */
  retirePolicy(id: number, context: Context, expiry_date?: Date): Promise<boolean>;
}
