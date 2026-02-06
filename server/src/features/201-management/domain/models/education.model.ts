import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { EducationBusinessException } from '../exceptions';

export class Education {
  id?: number;
  employee_id: number;
  education_school_id: number;
  education_school?: string;
  education_level_id: number;
  education_level?: string;
  education_course_id?: number;
  education_course?: string;
  education_course_level_id?: number;
  education_course_level?: string;
  school_year: string;
  deleted_by: string | null;
  deleted_at: Date | null;
  created_by: string | null;
  created_at: Date;
  updated_by: string | null;
  updated_at: Date;

  constructor(dto: {
    id?: number;
    employee_id: number;
    education_school_id: number;
    education_school?: string;
    education_level_id: number;
    education_level?: string;
    education_course_id?: number;
    education_course?: string;
    education_course_level_id?: number;
    education_course_level?: string;
    school_year: string;
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = dto.id;
    this.employee_id = dto.employee_id;
    this.education_school_id = dto.education_school_id;
    this.education_school = dto.education_school;
    this.education_level_id = dto.education_level_id;
    this.education_level = dto.education_level;
    this.education_course_id = dto.education_course_id;
    this.education_course = dto.education_course;
    this.education_course_level_id = dto.education_course_level_id;
    this.education_course_level = dto.education_course_level;
    this.school_year = dto.school_year;
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
    this.created_by = dto.created_by ?? null;
    this.created_at = dto.created_at ?? getPHDateTime();
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime();
  }

  /**
   * Creates a new education instance with validation
   */
  static create(params: {
    employee_id: number;
    education_school_id: number;
    education_level_id: number;
    education_course_id?: number;
    education_course_level_id?: number;
    school_year: string;
    created_by?: string | null;
  }): Education {
    const education = new Education({
      employee_id: params.employee_id,
      education_school_id: params.education_school_id,
      education_level_id: params.education_level_id,
      education_course_id: params.education_course_id,
      education_course_level_id: params.education_course_level_id,
      school_year: params.school_year,
      created_by: params.created_by ?? null,
    });
    education.validate();
    return education;
  }

  /**
   * Updates the education details
   */
  update(dto: {
    education_school_id?: number;
    education_level_id?: number;
    education_course_id?: number | null;
    education_course_level_id?: number | null;
    school_year?: string;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new EducationBusinessException(
        'Education record is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }

    if (dto.education_school_id !== undefined) {
      this.education_school_id = dto.education_school_id;
    }
    if (dto.education_level_id !== undefined) {
      this.education_level_id = dto.education_level_id;
    }
    if (dto.education_course_id !== undefined) {
      this.education_course_id = dto.education_course_id ?? undefined;
    }
    if (dto.education_course_level_id !== undefined) {
      this.education_course_level_id =
        dto.education_course_level_id ?? undefined;
    }
    if (dto.school_year !== undefined) {
      this.school_year = dto.school_year;
    }
    this.updated_by = dto.updated_by ?? null;
    this.validate();
  }

  /**
   * Archives (soft deletes) the education record
   */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new EducationBusinessException(
        'Education record is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }

    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;
  }

  /**
   * Restores a previously archived education record
   */
  restore(): void {
    if (!this.deleted_at) {
      throw new EducationBusinessException(
        `Education record with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }

    this.deleted_at = null;
    this.deleted_by = null;
  }

  /**
   * Validates the education record against business rules
   */
  validate(): void {
    if (!this.employee_id || this.employee_id <= 0) {
      throw new EducationBusinessException(
        'Employee ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.education_school_id || this.education_school_id <= 0) {
      throw new EducationBusinessException(
        'Education school ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.education_level_id || this.education_level_id <= 0) {
      throw new EducationBusinessException(
        'Education level ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.school_year || this.school_year.trim().length === 0) {
      throw new EducationBusinessException(
        'School year is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.school_year.length > 50) {
      throw new EducationBusinessException(
        'School year must not exceed 50 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (
      this.education_course_id !== undefined &&
      this.education_course_id !== null &&
      this.education_course_id <= 0
    ) {
      throw new EducationBusinessException(
        'Education course ID must be a positive number if provided.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (
      this.education_course_level_id !== undefined &&
      this.education_course_level_id !== null &&
      this.education_course_level_id <= 0
    ) {
      throw new EducationBusinessException(
        'Education course level ID must be a positive number if provided.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }
}
