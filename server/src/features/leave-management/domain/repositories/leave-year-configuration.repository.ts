import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeaveYearConfiguration } from '../models/leave-year-configuration.model';

export interface LeaveYearConfigurationRepository<Context = unknown> {
  create(
    leave_year_configuration: LeaveYearConfiguration,
    context: Context,
  ): Promise<LeaveYearConfiguration>;
  update(
    id: number,
    dto: Partial<LeaveYearConfiguration>,
    context: Context,
  ): Promise<boolean>;
  findById(
    id: number,
    context: Context,
  ): Promise<LeaveYearConfiguration | null>;
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<LeaveYearConfiguration>>;
  findByYear(
    year: string,
    context: Context,
  ): Promise<LeaveYearConfiguration | null>;
  findActiveForDate(
    date: Date,
    context: Context,
  ): Promise<LeaveYearConfiguration | null>;
  findAll(
    context: Context,
  ): Promise<LeaveYearConfiguration[]>;
}
