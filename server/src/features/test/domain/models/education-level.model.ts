import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { EducationLevelBusinessException } from '../exceptions/education-level.exception';
import { toLowerCaseString, toNumber } from '@/core/utils/coercion.util';

/**
 * EducationLevel domain entity.
 *
 * Encapsulates all business rules and state transitions for a educationLevel.
 *
 * Two ways to instantiate:
 * - `EducationLevel.create()` — for new educationLevel (validates business rules)
 * - `EducationLevel.fromPersistence()` — for rehydrating from the database (no validation)
 */
export class EducationLevel {
  /** Auto-incremented primary key. Null when not yet persisted. */
  id?: number | null;

  /** educationLevel description / name. e.g. 'manager', 'supervisor', etc. */
  desc1: string;

  /** Who created this educationLevel. Required at creation time. */
  created_by: string;

  /**
   * Timestamp when this educationLevel was created.
   * Set temporarily in-memory on construction; TypeORM overrides this on INSERT via @CreateDateColumn.
   * Authoritative value comes from the database after persist.
   */
  created_at: Date;

  /** Who last updated this educationLevel. Null until first update. */
  updated_by: string | null;

  /**
   * Timestamp of the last update.
   * Set temporarily in-memory on construction; TypeORM overrides this on UPDATE via @UpdateDateColumn.
   * Authoritative value comes from the database after persist.
   */
  updated_at: Date;

  /** Who archived (soft-deleted) this educationLevel. Null if not archived. */
  deleted_by: string | null;

  /** Timestamp when this educationLevel was archived. Null if not archived. */
  deleted_at: Date | null;

  /**
   * Normalizes and initializes educationLevel fields from a raw DTO.
   *
   * Responsibilities:
   * - Coerces all string fields to lowercase via `toLowerCaseString`
   * - Defaults optional audit fields to null
   * - Sets in-memory timestamps for `created_at` and `updated_at` if not provided
   *
   * Note: `created_at` and `updated_at` are managed by TypeORM (@CreateDateColumn /
   * @UpdateDateColumn) at the DB level. Values set here are temporary and will be
   * overridden on persist. Authoritative values come back via `fromPersistence()`.
   *
   * Does NOT validate business rules — call `validate()` or use `create()` for that.
   */
  constructor(dto: {
    id?: number | null;
    desc1: string;
    created_by: string;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
    deleted_by?: string | null;
    deleted_at?: Date | null;
  }) {
    this.id = toNumber(dto.id);
    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.created_by = toLowerCaseString(dto.created_by) ?? '';
    this.created_at = dto.created_at ?? getPHDateTime(); // temporary; TypeORM overrides on INSERT
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime(); // temporary; TypeORM overrides on UPDATE
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
  }

  /**
   * Static factory method — the preferred way to create a new educationLevel.
   *
   * Constructs and validates the educationLevel in one step.
   * Throws `EducationLevelBusinessException` if any business rule is violated.
   */
  static create(params: { desc1: string; created_by: string }): EducationLevel {
    const education_level = new EducationLevel({
      desc1: params.desc1,
      created_by: params.created_by,
    });
    education_level.validate();
    return education_level;
  }

  /**
   * Rehydrates a educationLevel from a raw database record.
   *
   * Used in repository `entityToModel()` to map DB rows back to the domain model.
   * Bypasses validation since data from the DB is already assumed to be valid.
   */
  static fromPersistence(entity: Record<string, unknown>): EducationLevel {
    return new EducationLevel({
      id: entity.id as number,
      desc1: entity.desc1 as string,
      created_by: entity.created_by as string,
      created_at: entity.created_at as Date,
      updated_by: entity.updated_by as string | null,
      updated_at: entity.updated_at as Date,
      deleted_by: entity.deleted_by as string | null,
      deleted_at: entity.deleted_at as Date | null,
    });
  }

  /**
   * Updates the educationLevel description and audit fields.
   *
   * - Throws if the educationLevel is currently archived.
   * - Normalizes inputs before applying.
   * - Validates the new state after applying changes.
   * - Note: `updated_at` is managed by TypeORM (@UpdateDateColumn), not set here.
   */
  update(dto: { desc1: string; updated_by?: string | null }): void {
    if (this.deleted_at) {
      throw new EducationLevelBusinessException(
        'EducationLevel is archived and cannot be updated.',
        HTTP_STATUS.CONFLICT,
      );
    }

    this.desc1 = toLowerCaseString(dto.desc1) ?? '';
    this.updated_by = toLowerCaseString(dto.updated_by) ?? null;

    this.validate();
  }

  /**
   * Soft-deletes the educationLevel (archive).
   *
   * - Throws if the educationLevel is already archived.
   * - Sets `deleted_at` to the current PH datetime.
   * - Records who performed the archive.
   */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new EducationLevelBusinessException(
        'EducationLevel is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = toLowerCaseString(deleted_by) ?? null;
  }

  /**
   * Restores an archived educationLevel.
   *
   * - Throws if the educationLevel is not currently archived.
   * - Clears `deleted_at` and `deleted_by`.
   */
  restore(): void {
    if (!this.deleted_at) {
      throw new EducationLevelBusinessException(
        `EducationLevel with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = null;
    this.deleted_by = null;
  }

  /**
   * Enforces business rules on the current state.
   *
   * Called by `create()` and `update()`.
   * Throws `EducationLevelBusinessException` with BAD_REQUEST on any violation.
   */
  validate(): void {
    // desc1 validations
    if (!this.desc1 || this.desc1.trim().length === 0) {
      throw new EducationLevelBusinessException(
        'EducationLevel description (desc1) is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.trim().length < 2) {
      throw new EducationLevelBusinessException(
        'EducationLevel description (desc1) must be at least 2 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.desc1.length > 255) {
      throw new EducationLevelBusinessException(
        'EducationLevel description (desc1) must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }
}
