import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { HolidayBusinessException } from '../exceptions/holiday-business.exception';
import { toLowerCaseString, toNumber, toDate } from '@/core/utils/coercion.util';

/**
 * Holiday domain entity.
 *
 * Encapsulates all business rules and state transitions for a holiday.
 *
 * Two ways to instantiate:
 * - `Holiday.create()` — for new holidays (validates business rules)
 * - `Holiday.fromPersistence()` — for rehydrating from the database (no validation)
 */
export class Holiday {
  /** Auto-incremented primary key. Null when not yet persisted. */
  id?: number | null;

  /** Holiday name/description. e.g. "new year's day", "independence day" */
  name: string;

  /** Holiday date (required, always in PH timezone). e.g. January 1, 2026 */
  date: Date;

  /** Holiday type (e.g. 'regular', 'special', etc). */
  type: string;

  /** Optional description, extended info. */
  description: string | null;

  /** If true, holiday recurs annually. */
  is_recurring: boolean;

  /** Who created this holiday. Required at creation time. */
  created_by: string;

  /**
   * Timestamp when this holiday was created.
   * Set temporarily in-memory on construction; TypeORM overrides this on INSERT via @CreateDateColumn.
   * Authoritative value comes from the database after persist.
   */
  created_at: Date;

  /** Who archived (soft-deleted) this holiday. Null if not archived. */
  deleted_by: string | null;

  /** Timestamp when this holiday was archived. Null if not archived. */
  deleted_at: Date | null;

  /** Who last updated this holiday. Null until first update. */
  updated_by: string | null;

  /**
   * Timestamp of the last update.
   * Set temporarily in-memory on construction; TypeORM overrides this on UPDATE via @UpdateDateColumn.
   * Authoritative value comes from the database after persist.
   */
  updated_at: Date | null;

  /**
   * Normalizes and initializes holiday fields from a raw DTO.
   *
   * Responsibilities:
   * - Coerces all string fields to lowercase via `toLowerCaseString`
   * - Coerces dates to Date
   * - Defaults optional audit fields to null
   * - Sets in-memory timestamps for created_at and updated_at if not provided
   *
   * Does NOT validate business rules — call `validate()` or use `create()` for that.
   */
  constructor(dto: {
    id?: number | null;
    name: string;
    date: Date;
    type: string;
    created_by: string;
    description?: string | null;
    is_recurring?: boolean;
    created_at?: Date;
    updated_by?: string | null;
    updated_at?: Date;
    deleted_by?: string | null;
    deleted_at?: Date | null;
  }) {
    this.id = toNumber(dto.id);
    this.name = toLowerCaseString(dto.name) ?? '';
    this.date = toDate(dto.date)!;
    this.type = toLowerCaseString(dto.type) ?? '';
    this.description = toLowerCaseString(dto.description) ?? null;
    this.is_recurring = dto.is_recurring ?? false;
    this.created_by = toLowerCaseString(dto.created_by) ?? '';
    this.created_at = dto.created_at ?? getPHDateTime(); // temporary; TypeORM overrides on INSERT
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime(); // temporary; TypeORM overrides on UPDATE
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
  }

  /**
   * Static factory method — the preferred way to create a new Holiday.
   *
   * Constructs and validates the holiday in one step.
   * Throws `HolidayBusinessException` if any business rule is violated.
   */
  static create(params: {
    name: string;
    date: Date;
    type: string;
    description?: string | null;
    is_recurring?: boolean;
    created_by: string;
  }): Holiday {
    const holiday = new Holiday({
      name: params.name,
      date: params.date,
      type: params.type,
      description: params.description,
      is_recurring: params.is_recurring,
      created_by: params.created_by,
    });
    holiday.validate();
    return holiday;
  }

  /**
   * Rehydrates a Holiday from a raw database record.
   *
   * Used in repository `entityToModel()` to map DB rows back to the domain model.
   * Bypasses validation since data from the DB is already assumed to be valid.
   */
  static fromPersistence(entity: Record<string, unknown>): Holiday {
    return new Holiday({
      id: entity.id as number,
      name: entity.name as string,
      date: entity.date as Date,
      type: entity.type as string,
      created_by: entity.created_by as string,
      created_at: entity.created_at as Date,
      updated_by: entity.updated_by as string | null,
      updated_at: entity.updated_at as Date,
      description: entity.description as string | null,
      is_recurring: entity.is_recurring as boolean,
      deleted_by: entity.deleted_by as string | null,
      deleted_at: entity.deleted_at as Date | null,
    });
  }

  /**
   * Updates the holiday details and audit fields.
   *
   * - Throws if the holiday is currently archived.
   * - Normalizes inputs before applying.
   * - Validates the new state after applying changes.
   * - Note: `updated_at` is managed by TypeORM (@UpdateDateColumn), not set here.
   */
  update(dto: {
    name: string;
    date: Date;
    type: string;
    description?: string | null;
    is_recurring?: boolean;
    updated_by?: string | null;
  }): void {
    if (this.deleted_at) {
      throw new HolidayBusinessException(
        'Holiday is archived and cannot be updated.',
        HTTP_STATUS.CONFLICT,
      );
    }

    this.name = toLowerCaseString(dto.name) ?? '';
    this.date = toDate(dto.date)!;
    this.type = toLowerCaseString(dto.type) ?? '';
    this.description = toLowerCaseString(dto.description) ?? null;
    this.is_recurring = dto.is_recurring ?? this.is_recurring;
    this.updated_by = toLowerCaseString(dto.updated_by) ?? null;

    this.validate();
  }

  /**
   * Soft-deletes the holiday (archive).
   *
   * - Throws if the holiday is already archived.
   * - Sets `deleted_at` to the current PH datetime.
   * - Records who performed the archive.
   */
  archive(deleted_by: string): void {
    if (this.deleted_at) {
      throw new HolidayBusinessException(
        'Holiday is already archived.',
        HTTP_STATUS.CONFLICT,
      );
    }
    this.deleted_at = getPHDateTime();
    this.deleted_by = toLowerCaseString(deleted_by) ?? null;
  }

  /**
   * Restores an archived holiday.
   *
   * - Throws if the holiday is not currently archived.
   * - Clears `deleted_at` and `deleted_by`.
   */
  restore(): void {
    if (!this.deleted_at) {
      throw new HolidayBusinessException(
        `Holiday with ID ${this.id} is not archived.`,
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
   * Throws `HolidayBusinessException` with BAD_REQUEST on any violation.
   */
  validate(): void {
    // name validations
    if (!this.name || this.name.trim().length === 0) {
      throw new HolidayBusinessException(
        'Holiday name is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.name.trim().length < 2) {
      throw new HolidayBusinessException(
        'Holiday name must be at least 2 characters long.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.name.length > 255) {
      throw new HolidayBusinessException(
        'Holiday name must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // date validation
    if (!this.date || !(this.date instanceof Date) || isNaN(this.date.getTime())) {
      throw new HolidayBusinessException(
        'Holiday date is required and must be a valid date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // type validations
    if (!this.type || this.type.trim().length === 0) {
      throw new HolidayBusinessException(
        'Holiday type is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (this.type.length > 50) {
      throw new HolidayBusinessException(
        'Holiday type must not exceed 50 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // description validations (optional, if provided)
    if (this.description !== undefined && this.description !== null) {
      if (this.description.length > 500) {
        throw new HolidayBusinessException(
          'Holiday description must not exceed 500 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }
}
