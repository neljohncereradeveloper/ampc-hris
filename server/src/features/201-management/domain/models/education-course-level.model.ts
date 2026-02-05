import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { EducationCourseLevelBusinessException } from '../exceptions';

export class EducationCourseLevel {
  id?: number;
  desc1: string;
  deleted_by: string | null;
  deleted_at: Date | null;
  created_by: string | null;
  created_at: Date;
  updated_by: string | null;
  updated_at: Date;

  constructor(dto: {
    id?: number;
    desc1: string;
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = dto.id;
    this.desc1 = dto.desc1;
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
    this.created_by = dto.created_by ?? null;
    this.created_at = dto.created_at ?? getPHDateTime();
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime();
  }

  /** Static factory: create and validate. */
  static create(params: {
    desc1: string;
    created_by?: string | null;
  }): EducationCourseLevel {
    const education_course_level = new EducationCourseLevel({
      desc1: params.desc1,
      created_by: params.created_by ?? null,
    });
    education_course_level.validate();
    return education_course_level;
  }

  /** Update details; validate new state before applying. */
  update(dto: {
    desc1: string;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new EducationCourseLevelBusinessException(
        'Education course level is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }
    const temp_education_course_level = new EducationCourseLevel({
      id: this.id,
      desc1: dto.desc1,
      created_at: this.created_at,
      updated_at: this.updated_at,
    });
    temp_education_course_level.validate();
    this.desc1 = dto.desc1;
    this.updated_by = dto.updated_by ?? null;
  }

  /** Soft-delete. */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new EducationCourseLevelBusinessException(
        'Education course level is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;
  }

  /** Restore from archive. */
  restore(): void {
    if (!this.deleted_at) {
      throw new EducationCourseLevelBusinessException(
        `Education course level with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  /** Enforce business rules. */
  validate(): void {
    if (!this.desc1 || this.desc1.trim().length === 0) {
      throw new EducationCourseLevelBusinessException(
        'Education course level name is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.length > 255) {
      throw new EducationCourseLevelBusinessException(
        'Education course level name must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.trim().length < 3) {
      throw new EducationCourseLevelBusinessException(
        'Education course level name must be at least 3 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }
}
