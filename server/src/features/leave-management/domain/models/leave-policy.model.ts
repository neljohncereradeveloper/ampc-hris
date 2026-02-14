import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { EnumLeavePolicyStatus } from '../enum';
import { LeavePolicyBusinessException } from '../exceptions';

export class LeavePolicy {
  id?: number;
  leave_type_id: number;
  leave_type?: string;
  annual_entitlement: number;
  carry_limit: number;
  encash_limit: number;
  carried_over_years: number;
  effective_date?: Date;
  expiry_date?: Date;
  status: EnumLeavePolicyStatus;
  remarks?: string;
  minimum_service_months?: number;
  allowed_employment_types?: string[];
  allowed_employee_statuses?: string[];
  excluded_weekdays?: number[];
  deleted_by: string | null;
  deleted_at: Date | null;
  created_by: string | null;
  created_at: Date;
  updated_by: string | null;
  updated_at: Date;

  constructor(dto: {
    id?: number;
    leave_type_id: number;
    leave_type?: string;
    annual_entitlement: number;
    carry_limit: number;
    encash_limit: number;
    carried_over_years: number;
    effective_date?: Date;
    expiry_date?: Date;
    status: EnumLeavePolicyStatus;
    remarks?: string;
    minimum_service_months?: number;
    allowed_employment_types?: string[];
    allowed_employee_statuses?: string[];
    excluded_weekdays?: number[];
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = dto.id;
    this.leave_type_id = dto.leave_type_id;
    this.leave_type = dto.leave_type;
    this.annual_entitlement = dto.annual_entitlement;
    this.carry_limit = dto.carry_limit;
    this.encash_limit = dto.encash_limit;
    this.carried_over_years = dto.carried_over_years;
    this.effective_date = dto.effective_date;
    this.expiry_date = dto.expiry_date;
    this.status = dto.status;
    this.remarks = dto.remarks;
    this.minimum_service_months = dto.minimum_service_months ?? 0;
    this.allowed_employment_types = dto.allowed_employment_types ?? [];
    this.allowed_employee_statuses = dto.allowed_employee_statuses ?? [];
    this.excluded_weekdays = dto.excluded_weekdays;
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
    this.created_by = dto.created_by ?? null;
    this.created_at = dto.created_at ?? getPHDateTime();
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime();
  }

  static create(params: {
    leave_type_id: number;
    annual_entitlement: number;
    carry_limit: number;
    encash_limit: number;
    carried_over_years: number;
    effective_date?: Date;
    expiry_date?: Date;
    status: EnumLeavePolicyStatus;
    remarks?: string;
    minimum_service_months?: number;
    allowed_employment_types?: string[];
    allowed_employee_statuses?: string[];
    excluded_weekdays?: number[];
    created_by?: string | null;
  }): LeavePolicy {
    const leave_policy = new LeavePolicy({
      leave_type_id: params.leave_type_id,
      annual_entitlement: params.annual_entitlement,
      carry_limit: params.carry_limit,
      encash_limit: params.encash_limit,
      carried_over_years: params.carried_over_years,
      effective_date: params.effective_date,
      expiry_date: params.expiry_date,
      status: params.status,
      remarks: params.remarks,
      minimum_service_months: params.minimum_service_months ?? 0,
      allowed_employment_types: params.allowed_employment_types ?? [],
      allowed_employee_statuses: params.allowed_employee_statuses ?? [],
      excluded_weekdays: params.excluded_weekdays,
      created_by: params.created_by ?? null,
    });
    leave_policy.validate();
    return leave_policy;
  }

  update(dto: {
    annual_entitlement?: number;
    carry_limit?: number;
    encash_limit?: number;
    carried_over_years?: number;
    effective_date?: Date;
    expiry_date?: Date;
    status?: EnumLeavePolicyStatus;
    remarks?: string;
    minimum_service_months?: number;
    allowed_employment_types?: string[];
    allowed_employee_statuses?: string[];
    excluded_weekdays?: number[];
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new LeavePolicyBusinessException(
        'Leave policy is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }
    if (dto.annual_entitlement !== undefined) this.annual_entitlement = dto.annual_entitlement;
    if (dto.carry_limit !== undefined) this.carry_limit = dto.carry_limit;
    if (dto.encash_limit !== undefined) this.encash_limit = dto.encash_limit;
    if (dto.carried_over_years !== undefined) this.carried_over_years = dto.carried_over_years;
    if (dto.effective_date !== undefined) this.effective_date = dto.effective_date;
    if (dto.expiry_date !== undefined) this.expiry_date = dto.expiry_date;
    if (dto.status !== undefined) this.status = dto.status;
    if (dto.remarks !== undefined) this.remarks = dto.remarks;
    if (dto.minimum_service_months !== undefined) this.minimum_service_months = dto.minimum_service_months;
    if (dto.allowed_employment_types !== undefined) this.allowed_employment_types = dto.allowed_employment_types;
    if (dto.allowed_employee_statuses !== undefined) this.allowed_employee_statuses = dto.allowed_employee_statuses;
    if (dto.excluded_weekdays !== undefined) this.excluded_weekdays = dto.excluded_weekdays;
    this.updated_by = dto.updated_by ?? null;
    this.validate();
  }

  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new LeavePolicyBusinessException(
        'Leave policy is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;
  }

  restore(): void {
    if (!this.deleted_at) {
      throw new LeavePolicyBusinessException(
        `Leave policy with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  validate(): void {
    if (!this.leave_type_id || this.leave_type_id <= 0) {
      throw new LeavePolicyBusinessException(
        'Leave type ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.annual_entitlement < 0) {
      throw new LeavePolicyBusinessException(
        'Annual entitlement must be a non-negative number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.carry_limit < 0) {
      throw new LeavePolicyBusinessException(
        'Carry limit must be a non-negative number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.encash_limit < 0) {
      throw new LeavePolicyBusinessException(
        'Encash limit must be a non-negative number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.carried_over_years || this.carried_over_years <= 0) {
      throw new LeavePolicyBusinessException(
        'Carried over years is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.effective_date != null && (!(this.effective_date instanceof Date) || isNaN(this.effective_date.getTime()))) {
      throw new LeavePolicyBusinessException(
        'Effective date must be a valid date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.expiry_date != null) {
      if (!(this.expiry_date instanceof Date) || isNaN(this.expiry_date.getTime())) {
        throw new LeavePolicyBusinessException(
          'Expiry date must be a valid date.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      if (this.effective_date && this.expiry_date <= this.effective_date) {
        throw new LeavePolicyBusinessException(
          'Expiry date must be after effective date.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
    if (this.remarks != null && this.remarks !== undefined) {
      if (this.remarks.trim().length === 0) {
        throw new LeavePolicyBusinessException(
          'Remarks cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      if (this.remarks.length > 500) {
        throw new LeavePolicyBusinessException(
          'Remarks must not exceed 500 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
    if (this.minimum_service_months != null && this.minimum_service_months < 0) {
      throw new LeavePolicyBusinessException(
        'Minimum service months must be a non-negative number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }
}
