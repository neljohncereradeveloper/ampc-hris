import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeavePolicy } from '../models/leave-policy.model';

export interface LeavePolicyRepository<Context = unknown> {
  create(leave_policy: LeavePolicy, context: Context): Promise<LeavePolicy>;
  update(
    id: number,
    dto: Partial<LeavePolicy>,
    context: Context,
  ): Promise<boolean>;
  findById(id: number, context: Context): Promise<LeavePolicy | null>;
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<LeavePolicy>>;
  retrieveActivePolicies(context: Context): Promise<LeavePolicy[]>;
  getActivePolicy(
    leave_type_id: number,
    context: Context,
  ): Promise<LeavePolicy | null>;
  activatePolicy(id: number, context: Context): Promise<boolean>;
  retirePolicy(id: number, context: Context, expiry_date?: Date): Promise<boolean>;
}
