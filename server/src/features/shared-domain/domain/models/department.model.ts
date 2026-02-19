import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { DepartmentBusinessException } from '../exceptions/department-business.exception';
import { toDate, toLowerCaseString, toNumber } from '@/core/utils/coercion.util';

export class Department {
  id?: number;
  desc1: string;
  code: string;
  designation: string;
  remarks?: string;
  deleted_by: string | null;
  deleted_at: Date | null;
  created_by: string | null;
  created_at: Date;
  updated_by: string | null;
  updated_at: Date;

  constructor(dto: {
    id?: number;
    desc1: string;
    code: string;
    designation: string;
    remarks?: string;
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = toNumber(dto.id);
    this.desc1 = toLowerCaseString(dto.desc1)!;
    this.code = toLowerCaseString(dto.code)!;
    this.designation = toLowerCaseString(dto.designation)!;
    this.remarks = toLowerCaseString(dto.remarks);
    this.deleted_by = toLowerCaseString(dto.deleted_by) ?? null;
    this.deleted_at = toDate(dto.deleted_at) ?? null;
    this.created_by = toLowerCaseString(dto.created_by) ?? null;
    this.created_at = toDate(dto.created_at) ?? getPHDateTime();
    this.updated_by = toLowerCaseString(dto.updated_by) ?? null;
    this.updated_at = toDate(dto.updated_at) ?? getPHDateTime();
  }

  /** Static factory: create and validate. */
  static create(params: {
    desc1: string;
    code: string;
    designation: string;
    remarks?: string;
    created_by?: string | null;
  }): Department {
    const department = new Department({
      desc1: params.desc1,
      code: params.code,
      designation: params.designation,
      remarks: params.remarks,
      created_by: params.created_by ?? null,
    });
    department.validate();
    return department;
  }

  /** Update details; validate new state before applying. */
  update(dto: { desc1: string; code: string; designation: string; remarks?: string; updated_by?: string | null }): void {
    if (this.deleted_at) {
      throw new DepartmentBusinessException(
        'Department is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }
    const temp_department = new Department({
      id: this.id,
      desc1: dto.desc1,
      code: dto.code,
      designation: dto.designation,
      remarks: dto.remarks,
      created_at: this.created_at,
      updated_at: this.updated_at,
    });
    temp_department.validate();
    this.desc1 = toLowerCaseString(dto.desc1)!;
    this.code = toLowerCaseString(dto.code)!;
    this.designation = toLowerCaseString(dto.designation)!;
    this.remarks = toLowerCaseString(dto.remarks);
    this.updated_by = toLowerCaseString(dto.updated_by) ?? null;
  }

  /** Soft-delete. */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new DepartmentBusinessException(
        'Department is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = toLowerCaseString(deleted_by) ?? null;
  }

  /** Restore from archive. */
  restore(): void {
    if (!this.deleted_at) {
      throw new DepartmentBusinessException(
        `Department with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  /** Enforce business rules. */
  validate(): void {
    if (!this.desc1 || this.desc1.trim().length === 0) {
      throw new DepartmentBusinessException(
        'Department description (desc1) is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.length > 255) {
      throw new DepartmentBusinessException(
        'Department description (desc1) must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.trim().length < 2) {
      throw new DepartmentBusinessException(
        'Department description (desc1) must be at least 2 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.code || this.code.trim().length === 0) {
      throw new DepartmentBusinessException(
        'Department code is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.code.length > 50) {
      throw new DepartmentBusinessException(
        'Department code must not exceed 50 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.code.trim().length < 2) {
      throw new DepartmentBusinessException(
        'Department code must be at least 2 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.designation || this.designation.trim().length === 0) {
      throw new DepartmentBusinessException(
        'Department designation is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.designation.length > 255) {
      throw new DepartmentBusinessException(
        'Department designation must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.designation.trim().length < 2) {
      throw new DepartmentBusinessException(
        'Department designation must be at least 2 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.remarks && this.remarks.trim().length === 0) {
      throw new DepartmentBusinessException(
        'Department remarks is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.remarks && this.remarks.length > 500) {
      throw new DepartmentBusinessException(
        'Department remarks must not exceed 500 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.remarks && this.remarks.trim().length < 2) {
      throw new DepartmentBusinessException(
        'Department remarks must be at least 2 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }
}
