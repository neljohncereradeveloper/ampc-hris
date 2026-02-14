import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { EnumLeaveCycleStatus } from '../enum';
import { LeaveCycleBusinessException } from '../exceptions';

export class LeaveCycle {
  id?: number;
  employee_id: number;
  leave_type_id: number;
  leave_type?: string;
  cycle_start_year: number;
  cycle_end_year: number;
  total_carried: number;
  status: EnumLeaveCycleStatus;
  deleted_by: string | null;
  deleted_at: Date | null;
  created_by: string | null;
  created_at: Date;
  updated_by: string | null;
  updated_at: Date;

  constructor(dto: {
    id?: number;
    employee_id: number;
    leave_type_id: number;
    leave_type?: string;
    cycle_start_year: number;
    cycle_end_year: number;
    total_carried: number;
    status: EnumLeaveCycleStatus;
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = dto.id;
    this.employee_id = dto.employee_id;
    this.leave_type_id = dto.leave_type_id;
    this.leave_type = dto.leave_type;
    this.cycle_start_year = dto.cycle_start_year;
    this.cycle_end_year = dto.cycle_end_year;
    this.total_carried = dto.total_carried;
    this.status = dto.status;
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
    this.created_by = dto.created_by ?? null;
    this.created_at = dto.created_at ?? getPHDateTime();
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime();
  }

  static create(params: {
    employee_id: number;
    leave_type_id: number;
    cycle_start_year: number;
    cycle_end_year: number;
    total_carried: number;
    status: EnumLeaveCycleStatus;
    created_by?: string | null;
  }): LeaveCycle {
    const leave_cycle = new LeaveCycle({
      employee_id: params.employee_id,
      leave_type_id: params.leave_type_id,
      cycle_start_year: params.cycle_start_year,
      cycle_end_year: params.cycle_end_year,
      total_carried: params.total_carried,
      status: params.status,
      created_by: params.created_by ?? null,
    });
    leave_cycle.validate();
    return leave_cycle;
  }

  update(dto: {
    total_carried?: number;
    status?: EnumLeaveCycleStatus;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new LeaveCycleBusinessException(
        'Leave cycle is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }
    if (dto.total_carried !== undefined) this.total_carried = dto.total_carried;
    if (dto.status !== undefined) this.status = dto.status;
    this.updated_by = dto.updated_by ?? null;
    this.validate();
  }

  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new LeaveCycleBusinessException(
        'Leave cycle is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;
  }

  restore(): void {
    if (!this.deleted_at) {
      throw new LeaveCycleBusinessException(
        `Leave cycle with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  validate(): void {
    if (!this.employee_id || this.employee_id <= 0) {
      throw new LeaveCycleBusinessException(
        'Employee ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.leave_type_id || this.leave_type_id <= 0) {
      throw new LeaveCycleBusinessException(
        'Leave type ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.cycle_start_year || this.cycle_start_year < 1900) {
      throw new LeaveCycleBusinessException(
        'Cycle start year is required and must be a valid year (>= 1900).',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.cycle_end_year || this.cycle_end_year < 1900) {
      throw new LeaveCycleBusinessException(
        'Cycle end year is required and must be a valid year (>= 1900).',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.cycle_end_year < this.cycle_start_year) {
      throw new LeaveCycleBusinessException(
        'Cycle end year must be greater than or equal to cycle start year.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.total_carried < 0) {
      throw new LeaveCycleBusinessException(
        'Total carried must be a non-negative number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }
}
