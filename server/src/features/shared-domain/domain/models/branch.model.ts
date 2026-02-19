import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { BranchBusinessException } from '../exceptions/branch-business.exception';
import { toDate, toLowerCaseString, toNumber } from '@/core/utils/coercion.util';

export class Branch {
  id?: number | null;
  desc1: string;
  br_code: string;
  deleted_by: string | null;
  deleted_at: Date | null;
  created_by: string | null;
  created_at: Date | null;
  updated_by: string | null;
  updated_at: Date | null;

  constructor(dto: {
    id?: number | null;
    desc1: string;
    br_code: string;
    created_by: string | null;
    deleted_by?: string | null;
    updated_by?: string | null;
  }) {
    this.id = toNumber(dto.id);
    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.br_code = toLowerCaseString(dto.br_code) ?? '';
    this.created_by = toLowerCaseString(dto.created_by)!;
    this.created_at = getPHDateTime(); // created now
    this.updated_by = null; // not updated by default
    this.updated_at = null; // not updated by default
    this.deleted_at = null; // not deleted by default
    this.deleted_by = null; // not deleted by default

  }

  /** Static factory: create and validate. */
  static create(params: { desc1: string; br_code: string; created_by?: string | null }): Branch {
    const branch = new Branch({
      desc1: params.desc1,
      br_code: params.br_code,
      created_by: params.created_by ?? null,
    });
    branch.validate();
    return branch;
  }

  update(dto: { desc1: string; br_code: string; updated_by?: string | null }): void {
    if (this.deleted_at) {
      throw new BranchBusinessException(
        'Branch is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }

    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.br_code = toLowerCaseString(dto.br_code) ?? '';
    this.updated_by = toLowerCaseString(dto.updated_by) ?? null;
    this.updated_at = getPHDateTime();

    this.validate();
  }

  /** Soft-delete. */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new BranchBusinessException(
        'Branch is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = toLowerCaseString(deleted_by) ?? null;
  }

  /** Restore from archive. */
  restore(): void {
    if (!this.deleted_at) {
      throw new BranchBusinessException(
        `Branch with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  /** Enforce business rules. */
  validate(): void {
    if (!this.desc1 || this.desc1.trim().length === 0) {
      throw new BranchBusinessException(
        'Branch description (desc1) is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.length > 255) {
      throw new BranchBusinessException(
        'Branch description (desc1) must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.trim().length < 2) {
      throw new BranchBusinessException(
        'Branch description (desc1) must be at least 2 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }
}
