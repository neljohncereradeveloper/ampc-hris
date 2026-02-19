import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { LeaveTypeBusinessException } from '../exceptions/leave-type-business.exception';
import { toDate, toLowerCaseString, toNumber } from '@/core/utils/coercion.util';

export class LeaveType {
  id?: number;
  name: string;
  code: string;
  desc1: string;
  paid: boolean;
  remarks?: string;
  deleted_by: string | null;
  deleted_at: Date | null;
  created_by: string | null;
  created_at: Date;
  updated_by: string | null;
  updated_at: Date;

  constructor(dto: {
    id?: number;
    name: string;
    code: string;
    desc1: string;
    paid: boolean;
    remarks?: string;
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = toNumber(dto.id);
    this.name = toLowerCaseString(dto.name)!;
    this.code = toLowerCaseString(dto.code)!;
    this.desc1 = toLowerCaseString(dto.desc1)!;
    this.paid = dto.paid;
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
    name: string;
    code: string;
    desc1: string;
    paid: boolean;
    remarks?: string;
    created_by?: string | null;
  }): LeaveType {
    const leave_type = new LeaveType({
      name: params.name,
      code: params.code,
      desc1: params.desc1,
      paid: params.paid,
      remarks: params.remarks,
      created_by: params.created_by ?? null,
    });
    leave_type.validate();
    return leave_type;
  }

  /** Update details; validate new state before applying. */
  update(dto: {
    name?: string;
    code?: string;
    desc1?: string;
    paid?: boolean;
    remarks?: string;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new LeaveTypeBusinessException(
        'Leave type is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }
    if (dto.name !== undefined) this.name = toLowerCaseString(dto.name)!;
    if (dto.code !== undefined) this.code = toLowerCaseString(dto.code)!;
    if (dto.desc1 !== undefined) this.desc1 = toLowerCaseString(dto.desc1)!;
    if (dto.paid !== undefined) this.paid = dto.paid;
    if (dto.remarks !== undefined) this.remarks = toLowerCaseString(dto.remarks);
    this.updated_by = toLowerCaseString(dto.updated_by) ?? null;
    this.validate();
  }

  /** Soft-delete. */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new LeaveTypeBusinessException(
        'Leave type is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = toLowerCaseString(deleted_by) ?? null;
  }

  /** Restore from archive. */
  restore(): void {
    if (!this.deleted_at) {
      throw new LeaveTypeBusinessException(
        `Leave type with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  /** Enforce business rules. */
  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new LeaveTypeBusinessException(
        'Leave type name is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.name.length > 100) {
      throw new LeaveTypeBusinessException(
        'Leave type name must not exceed 100 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.code || this.code.trim().length === 0) {
      throw new LeaveTypeBusinessException(
        'Leave type code is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.code.length > 50) {
      throw new LeaveTypeBusinessException(
        'Leave type code must not exceed 50 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.desc1 || this.desc1.trim().length === 0) {
      throw new LeaveTypeBusinessException(
        'Leave type description is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.length > 255) {
      throw new LeaveTypeBusinessException(
        'Leave type description must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.remarks !== undefined && this.remarks !== null) {
      if (this.remarks.trim().length === 0) {
        throw new LeaveTypeBusinessException(
          'Remarks cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      if (this.remarks.length > 500) {
        throw new LeaveTypeBusinessException(
          'Remarks must not exceed 500 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }
}
