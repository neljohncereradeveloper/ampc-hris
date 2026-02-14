import { LeaveCycle } from '../models/leave-cycle.model';

export interface LeaveCycleRepository<Context = unknown> {
  create(leave_cycle: LeaveCycle, context: Context): Promise<LeaveCycle>;
  update(
    id: number,
    dto: Partial<LeaveCycle>,
    context: Context,
  ): Promise<boolean>;
  findById(id: number, context: Context): Promise<LeaveCycle | null>;
  findByEmployee(
    employee_id: number,
    context: Context,
  ): Promise<LeaveCycle[]>;
  getActiveCycle(
    employee_id: number,
    leave_type_id: number,
    context: Context,
  ): Promise<LeaveCycle | null>;
  findOverlappingCycle(
    employee_id: number,
    leave_type_id: number,
    cycle_start_year: number,
    cycle_end_year: number,
    context: Context,
  ): Promise<LeaveCycle | null>;
  closeCycle(id: number, context: Context): Promise<boolean>;
}
