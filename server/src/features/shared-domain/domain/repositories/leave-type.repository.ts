import { LeaveType } from '../models/leave-type.model';

export interface LeaveTypeRepository<Context = unknown> {
  /** Find a leave type by ID. */
  findById(id: number, context: Context): Promise<LeaveType | null>;
  /** Find a leave type by description. */
  findByDescription(description: string, context: Context): Promise<LeaveType | null>;
}
