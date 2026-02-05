import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { WorkExperienceBusinessException } from '../exceptions';

export class WorkExperience {
  id?: number;
  employee_id?: number;
  company_id?: number;
  company?: string;
  work_experience_job_title_id?: number;
  work_experience_job_title?: string;
  years?: string;
  deleted_by: string | null;
  deleted_at: Date | null;
  created_by: string | null;
  created_at: Date;
  updated_by: string | null;
  updated_at: Date;

  constructor(dto: {
    id?: number;
    employee_id?: number;
    company_id?: number;
    company?: string;
    work_experience_job_title_id?: number;
    work_experience_job_title?: string;
    years?: string;
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = dto.id;
    this.employee_id = dto.employee_id;
    this.company_id = dto.company_id;
    this.company = dto.company;
    this.work_experience_job_title_id = dto.work_experience_job_title_id;
    this.work_experience_job_title = dto.work_experience_job_title;
    this.years = dto.years;
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
    this.created_by = dto.created_by ?? null;
    this.created_at = dto.created_at ?? getPHDateTime();
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime();
  }

  /**
   * Creates a new work experience instance with validation
   */
  static create(params: {
    employee_id?: number;
    company_id?: number;
    work_experience_job_title_id?: number;
    years?: string;
    created_by?: string | null;
  }): WorkExperience {
    const work_experience = new WorkExperience({
      employee_id: params.employee_id,
      company_id: params.company_id,
      work_experience_job_title_id: params.work_experience_job_title_id,
      years: params.years,
      created_by: params.created_by ?? null,
    });
    work_experience.validate();
    return work_experience;
  }

  /**
   * Updates the work experience details
   */
  update(dto: {
    company_id?: number;
    work_experience_job_title_id?: number;
    years?: string;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new WorkExperienceBusinessException(
        'Work experience is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }

    if (dto.company_id !== undefined) {
      this.company_id = dto.company_id;
    }
    if (dto.work_experience_job_title_id !== undefined) {
      this.work_experience_job_title_id = dto.work_experience_job_title_id;
    }
    if (dto.years !== undefined) {
      this.years = dto.years;
    }
    this.updated_by = dto.updated_by ?? null;
    this.validate();
  }

  /**
   * Archives (soft deletes) the work experience
   */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new WorkExperienceBusinessException(
        'Work experience is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }

    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;
  }

  /**
   * Restores a previously archived work experience
   */
  restore(): void {
    if (!this.deleted_at) {
      throw new WorkExperienceBusinessException(
        `Work experience with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }

    this.deleted_at = null;
    this.deleted_by = null;
  }

  /**
   * Validates the work experience against business rules
   */
  validate(): void {
    // Validate if employee_id is provided and is a positive number
    if (this.employee_id !== undefined && this.employee_id !== null) {
      if (this.employee_id <= 0) {
        throw new WorkExperienceBusinessException(
          'Employee ID must be a positive number if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Validate optional company_id if provided
    if (this.company_id !== undefined && this.company_id !== null) {
      if (this.company_id <= 0) {
        throw new WorkExperienceBusinessException(
          'Company ID must be a positive number if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Validate optional work_experience_job_title_id if provided
    if (
      this.work_experience_job_title_id !== undefined &&
      this.work_experience_job_title_id !== null
    ) {
      if (this.work_experience_job_title_id <= 0) {
        throw new WorkExperienceBusinessException(
          'Work experience job title ID must be a positive number if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Validate optional years if provided
    if (this.years !== undefined && this.years !== null) {
      if (this.years.trim().length === 0) {
        throw new WorkExperienceBusinessException(
          'Years cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.years.length > 50) {
        throw new WorkExperienceBusinessException(
          'Years must not exceed 50 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      const textPattern = /^[a-zA-Z0-9\s\-_&.,()]+$/;
      if (!textPattern.test(this.years)) {
        throw new WorkExperienceBusinessException(
          'Years can only contain letters, numbers, spaces, and basic punctuation.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }
}
