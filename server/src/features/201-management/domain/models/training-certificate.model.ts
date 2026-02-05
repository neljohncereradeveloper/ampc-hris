import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { TrainingCertificateBusinessException } from '../exceptions';

export class TrainingCertificate {
  id?: number;
  certificate_name: string;
  issuing_organization: string;
  issue_date: Date;
  expiry_date?: Date | null;
  certificate_number?: string | null;
  file_path?: string | null;
  deleted_by: string | null;
  deleted_at: Date | null;
  created_by: string | null;
  created_at: Date;
  updated_by: string | null;
  updated_at: Date;

  constructor(dto: {
    id?: number;
    certificate_name: string;
    issuing_organization: string;
    issue_date: Date;
    expiry_date?: Date | null;
    certificate_number?: string | null;
    file_path?: string | null;
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = dto.id;
    this.certificate_name = dto.certificate_name;
    this.issuing_organization = dto.issuing_organization;
    this.issue_date = dto.issue_date;
    this.expiry_date = dto.expiry_date ?? null;
    this.certificate_number = dto.certificate_number ?? null;
    this.file_path = dto.file_path ?? null;
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
    this.created_by = dto.created_by ?? null;
    this.created_at = dto.created_at ?? getPHDateTime();
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime();
  }

  /**
   * Creates a new training certificate instance with validation
   */
  static create(params: {
    certificate_name: string;
    issuing_organization: string;
    issue_date: Date;
    expiry_date?: Date | null;
    certificate_number?: string | null;
    file_path?: string | null;
    created_by?: string | null;
  }): TrainingCertificate {
    const certificate = new TrainingCertificate({
      certificate_name: params.certificate_name,
      issuing_organization: params.issuing_organization,
      issue_date: params.issue_date,
      expiry_date: params.expiry_date,
      certificate_number: params.certificate_number,
      file_path: params.file_path,
      created_by: params.created_by ?? null,
    });
    certificate.validate();
    return certificate;
  }

  /**
   * Updates the training certificate details
   */
  update(dto: {
    certificate_name?: string;
    issuing_organization?: string;
    issue_date?: Date;
    expiry_date?: Date | null;
    certificate_number?: string | null;
    file_path?: string | null;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new TrainingCertificateBusinessException(
        'Training certificate is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }

    if (dto.certificate_name !== undefined) {
      this.certificate_name = dto.certificate_name;
    }
    if (dto.issuing_organization !== undefined) {
      this.issuing_organization = dto.issuing_organization;
    }
    if (dto.issue_date !== undefined) {
      this.issue_date = dto.issue_date;
    }
    if (dto.expiry_date !== undefined) {
      this.expiry_date = dto.expiry_date;
    }
    if (dto.certificate_number !== undefined) {
      this.certificate_number = dto.certificate_number;
    }
    if (dto.file_path !== undefined) {
      this.file_path = dto.file_path;
    }
    this.updated_by = dto.updated_by ?? null;
    this.validate();
  }

  /**
   * Archives (soft deletes) the training certificate
   */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new TrainingCertificateBusinessException(
        'Training certificate is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }

    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;
  }

  /**
   * Restores a previously archived training certificate
   */
  restore(): void {
    if (!this.deleted_at) {
      throw new TrainingCertificateBusinessException(
        `Training certificate with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }

    this.deleted_at = null;
    this.deleted_by = null;
  }

  /**
   * Validates the training certificate against business rules
   */
  validate(): void {
    if (!this.certificate_name || this.certificate_name.trim().length === 0) {
      throw new TrainingCertificateBusinessException(
        'Certificate name is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.certificate_name.length > 255) {
      throw new TrainingCertificateBusinessException(
        'Certificate name must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.issuing_organization || this.issuing_organization.trim().length === 0) {
      throw new TrainingCertificateBusinessException(
        'Issuing organization is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.issuing_organization.length > 255) {
      throw new TrainingCertificateBusinessException(
        'Issuing organization must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.issue_date) {
      throw new TrainingCertificateBusinessException(
        'Issue date is required.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.expiry_date && this.expiry_date < this.issue_date) {
      throw new TrainingCertificateBusinessException(
        'Expiry date cannot be earlier than issue date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.certificate_number !== null && this.certificate_number !== undefined) {
      if (this.certificate_number.trim().length === 0) {
        throw new TrainingCertificateBusinessException(
          'Certificate number cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.certificate_number.length > 100) {
        throw new TrainingCertificateBusinessException(
          'Certificate number must not exceed 100 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    if (this.file_path !== null && this.file_path !== undefined) {
      if (this.file_path.trim().length === 0) {
        throw new TrainingCertificateBusinessException(
          'File path cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.file_path.length > 500) {
        throw new TrainingCertificateBusinessException(
          'File path must not exceed 500 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }
}
