import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { LeaveYearConfigurationBusinessException } from '../exceptions';

export class LeaveYearConfiguration {
  /** Primary key; set after persistence. */
  id?: number;
  /** Start date of the leave year (e.g. Jan 1). */
  cutoff_start_date: Date;
  /** End date of the leave year (e.g. Dec 31). */
  cutoff_end_date: Date;
  /** Leave year label (e.g. "2025"). */
  year: string;
  /** Optional notes. */
  remarks?: string;
  /** User who soft-deleted this record. */
  deleted_by: string | null;
  /** When this record was soft-deleted. */
  deleted_at: Date | null;
  /** User who created this record. */
  created_by: string | null;
  /** When this record was created. */
  created_at: Date;
  /** User who last updated this record. */
  updated_by: string | null;
  /** When this record was last updated. */
  updated_at: Date;

  constructor(dto: {
    id?: number;
    cutoff_start_date: Date;
    cutoff_end_date: Date;
    year: string;
    remarks?: string;
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = dto.id;
    this.cutoff_start_date = dto.cutoff_start_date;
    this.cutoff_end_date = dto.cutoff_end_date;
    this.year = dto.year;
    this.remarks = dto.remarks;
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
    this.created_by = dto.created_by ?? null;
    this.created_at = dto.created_at ?? getPHDateTime();
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime();
  }

  static create(params: {
    cutoff_start_date: Date;
    cutoff_end_date: Date;
    year: string;
    remarks?: string;
    created_by?: string | null;
  }): LeaveYearConfiguration {
    const leave_year_configuration = new LeaveYearConfiguration({
      cutoff_start_date: params.cutoff_start_date,
      cutoff_end_date: params.cutoff_end_date,
      year: params.year,
      remarks: params.remarks,
      created_by: params.created_by ?? null,
    });
    leave_year_configuration.validate();
    return leave_year_configuration;
  }

  update(dto: {
    cutoff_start_date?: Date;
    cutoff_end_date?: Date;
    year?: string;
    remarks?: string;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new LeaveYearConfigurationBusinessException(
        'Leave year configuration is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }
    if (dto.cutoff_start_date !== undefined)
      this.cutoff_start_date = dto.cutoff_start_date;
    if (dto.cutoff_end_date !== undefined)
      this.cutoff_end_date = dto.cutoff_end_date;
    if (dto.year !== undefined) this.year = dto.year;
    if (dto.remarks !== undefined) this.remarks = dto.remarks;
    this.updated_by = dto.updated_by ?? null;
    this.validate();
  }

  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new LeaveYearConfigurationBusinessException(
        'Leave year configuration is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;
  }

  restore(): void {
    if (!this.deleted_at) {
      throw new LeaveYearConfigurationBusinessException(
        `Leave year configuration with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  validate(): void {
    if (!this.cutoff_start_date) {
      throw new LeaveYearConfigurationBusinessException(
        'Cutoff start date is required.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (
      !(this.cutoff_start_date instanceof Date) ||
      isNaN(this.cutoff_start_date.getTime())
    ) {
      throw new LeaveYearConfigurationBusinessException(
        'Cutoff start date must be a valid date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.cutoff_end_date) {
      throw new LeaveYearConfigurationBusinessException(
        'Cutoff end date is required.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (
      !(this.cutoff_end_date instanceof Date) ||
      isNaN(this.cutoff_end_date.getTime())
    ) {
      throw new LeaveYearConfigurationBusinessException(
        'Cutoff end date must be a valid date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.cutoff_end_date <= this.cutoff_start_date) {
      throw new LeaveYearConfigurationBusinessException(
        'Cutoff end date must be after cutoff start date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.year || this.year.trim().length === 0) {
      throw new LeaveYearConfigurationBusinessException(
        'Year is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.year.length > 20) {
      throw new LeaveYearConfigurationBusinessException(
        'Year must not exceed 20 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.remarks != null && this.remarks !== undefined) {
      if (this.remarks.trim().length === 0) {
        throw new LeaveYearConfigurationBusinessException(
          'Remarks cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      if (this.remarks.length > 500) {
        throw new LeaveYearConfigurationBusinessException(
          'Remarks must not exceed 500 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }
}
