import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { HolidayBusinessException } from '../exceptions/holiday-business.exception';
import { toLowerCaseString, toNumber, toDate } from '@/core/utils/coercion.util';

/**
 * Holiday domain entity.
 *
 * Encapsulates all business rules and state transitions for a holiday.
 * Use the static `create()` factory method to instantiate a validated holiday.
 */
export class Holiday {
  /** Auto-incremented primary key. */
  id?: number | null;

  /** Holiday name/description. */
  /** Example: New Year's Day, Independence Day, etc. */
  name: string;

  /** Holiday date (required, always in PH timezone). */
  /** Example: January 1, 2026, July 4, 2026, etc. */
  date: Date;

  /** Holiday type (e.g. 'regular', 'special', etc). */
  /** Example: National, Regional, Special, etc. */
  type: string;

  /** Optional description, extended info. */
  /** Example: New Year's Day is a national holiday in the Philippines. */
  description: string | null;

  /** If true, holiday recurs annually. */
  /** Example: true for holidays that recur annually, false for holidays that do not recur annually. */
  is_recurring: boolean;

  /** Who created this holiday. Required at creation time. */
  created_by: string;

  /** Timestamp when this holiday was created. Always set on construction. */
  created_at: Date;

  /** Who archived (soft-deleted) this holiday. Null if not archived. */
  deleted_by: string | null;

  /** Timestamp of archive. Null if not archived. */
  deleted_at: Date | null;

  /** Who last updated this holiday. Null until first update. */
  updated_by: string | null;

  /** Timestamp of the last update. */
  updated_at: Date | null;

  /**
   * Normalizes and initializes holiday fields from a raw DTO.
   *
   * Responsibilities:
   * - Coerces all string fields to lowercase via `toLowerCaseString`
   * - Coerces dates to Date
   * - Defaults audit fields to sensible values (now if missing)
   * - Defaults booleans to false
   * - Defaults optional fields (`updated_by`, `deleted_by`, etc) to null
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
    deleted_by?: string | null;
    updated_by?: string | null;
  }) {
    // note: only allow undefined/null for id
    this.id = toNumber(dto.id);
    this.name = toLowerCaseString(dto.name) ?? '';
    this.date = toDate(dto.date)!;
    this.type = toLowerCaseString(dto.type) ?? '';
    this.description = toLowerCaseString(dto.description) ?? null;
    this.is_recurring = dto.is_recurring ?? false;
    this.created_by = toLowerCaseString(dto.created_by) ?? '';
    this.created_at = getPHDateTime();
    this.updated_by = null;
    this.updated_at = null;
    this.deleted_by = null;
    this.deleted_at = null;
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
   * Updates the holiday details and audit fields.
   *
   * - Throws if the holiday is currently archived.
   * - Normalizes inputs before applying.
   * - Validates the new state after applying changes.
   * - Refreshes `updated_at` to the current PH datetime.
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

    // If validation ok, actually assign
    this.name = toLowerCaseString(dto.name) ?? '';
    this.date = toDate(dto.date)!;
    this.type = toLowerCaseString(dto.type) ?? '';
    this.description = toLowerCaseString(dto.description) ?? null;
    this.is_recurring = dto.is_recurring ?? this.is_recurring;
    this.updated_by = toLowerCaseString(dto.updated_by) ?? null;
    this.updated_at = getPHDateTime();

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
