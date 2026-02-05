import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { TrainingBusinessException } from '../exceptions';

export class Training {
  id?: number;
  employee_id?: number;
  training_date: Date;
  trainings_cert_id: number;
  trainings_certificate?: string;
  training_title?: string;
  desc1?: string;
  image_path?: string;
  deleted_by: string | null;
  deleted_at: Date | null;
  created_by: string | null;
  created_at: Date;
  updated_by: string | null;
  updated_at: Date;

  constructor(dto: {
    id?: number;
    employee_id?: number;
    training_date: Date;
    trainings_cert_id: number;
    trainings_certificate?: string;
    training_title?: string;
    desc1?: string;
    image_path?: string;
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
  }) {
    this.id = dto.id;
    this.employee_id = dto.employee_id;
    this.training_date = dto.training_date;
    this.trainings_cert_id = dto.trainings_cert_id;
    this.trainings_certificate = dto.trainings_certificate;
    this.training_title = dto.training_title;
    this.desc1 = dto.desc1;
    this.image_path = dto.image_path;
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
    this.created_by = dto.created_by ?? null;
    this.created_at = dto.created_at ?? getPHDateTime();
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime();
  }

  /**
   * Creates a new training instance with validation
   */
  static create(params: {
    employee_id?: number;
    training_date: Date;
    trainings_cert_id: number;
    training_title?: string;
    desc1?: string;
    image_path?: string;
    created_by?: string | null;
  }): Training {
    const training = new Training({
      employee_id: params.employee_id,
      training_date: params.training_date,
      trainings_cert_id: params.trainings_cert_id,
      training_title: params.training_title,
      desc1: params.desc1,
      image_path: params.image_path,
      created_by: params.created_by ?? null,
    });
    training.validate();
    return training;
  }

  /**
   * Updates the training details
   */
  update(dto: {
    training_date?: Date;
    trainings_cert_id?: number;
    training_title?: string;
    desc1?: string;
    image_path?: string;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new TrainingBusinessException(
        'Training is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }

    if (dto.training_date !== undefined) {
      this.training_date = dto.training_date;
    }
    if (dto.trainings_cert_id !== undefined) {
      this.trainings_cert_id = dto.trainings_cert_id;
    }
    if (dto.training_title !== undefined) {
      this.training_title = dto.training_title;
    }
    if (dto.desc1 !== undefined) {
      this.desc1 = dto.desc1;
    }
    if (dto.image_path !== undefined) {
      this.image_path = dto.image_path;
    }
    this.updated_by = dto.updated_by ?? null;
    this.validate();
  }

  /**
   * Archives (soft deletes) the training
   */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new TrainingBusinessException(
        'Training is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }

    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;
  }

  /**
   * Restores a previously archived training
   */
  restore(): void {
    if (!this.deleted_at) {
      throw new TrainingBusinessException(
        `Training with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }

    this.deleted_at = null;
    this.deleted_by = null;
  }

  /**
   * Validates the training against business rules
   */
  validate(): void {
    if (this.employee_id !== undefined && this.employee_id !== null) {
      if (this.employee_id <= 0) {
        throw new TrainingBusinessException(
          'Employee ID must be a positive number if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    if (!this.training_date) {
      throw new TrainingBusinessException(
        'Training date is required.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (
      !(this.training_date instanceof Date) ||
      isNaN(this.training_date.getTime())
    ) {
      throw new TrainingBusinessException(
        'Training date must be a valid date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const current_date = getPHDateTime();
    if (this.training_date > current_date) {
      throw new TrainingBusinessException(
        'Training date cannot be in the future.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.trainings_cert_id || this.trainings_cert_id <= 0) {
      throw new TrainingBusinessException(
        'Training certificate ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.training_title !== undefined && this.training_title !== null) {
      if (this.training_title.trim().length === 0) {
        throw new TrainingBusinessException(
          'Training title cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.training_title.length > 100) {
        throw new TrainingBusinessException(
          'Training title must not exceed 100 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      const textPattern = /^[a-zA-Z0-9\s\-_&.,()]+$/;
      if (!textPattern.test(this.training_title)) {
        throw new TrainingBusinessException(
          'Training title can only contain letters, numbers, spaces, and basic punctuation.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    if (this.desc1 !== undefined && this.desc1 !== null) {
      if (this.desc1.trim().length === 0) {
        throw new TrainingBusinessException(
          'Description cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.desc1.length > 500) {
        throw new TrainingBusinessException(
          'Description must not exceed 500 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      const textPattern = /^[a-zA-Z0-9\s\-_&.,()]+$/;
      if (!textPattern.test(this.desc1)) {
        throw new TrainingBusinessException(
          'Description can only contain letters, numbers, spaces, and basic punctuation.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    if (this.image_path !== undefined && this.image_path !== null) {
      if (this.image_path.trim().length === 0) {
        throw new TrainingBusinessException(
          'Image path cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.image_path.length > 500) {
        throw new TrainingBusinessException(
          'Image path must not exceed 500 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }
}
