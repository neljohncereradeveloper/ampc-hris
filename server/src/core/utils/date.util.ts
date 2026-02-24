import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom class-validator decorator: ensures the property is a valid date (YYYY-MM-DD string or valid Date).
 * Use on DTO properties that represent a date; validates format and that the date is real (e.g. not 2025-02-30).
 *
 * Process:
 * 1. If value is a Date, valid if getTime() is not NaN.
 * 2. If value is a string, must match YYYY-MM-DD and parse to a valid date whose ISO date part equals the string.
 * 3. Otherwise invalid.
 *
 * @param validationOptions - Optional class-validator options (e.g. message, groups)
 * @returns Decorator function to register with class-validator
 */
export function IsDateStringCustom(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateStringCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          // Handle Date objects (from @Transform)
          if (value instanceof Date) {
            return !isNaN(value.getTime());
          }

          // Handle string inputs
          if (typeof value === 'string') {
            // Check if the string matches YYYY-MM-DD format
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(value)) {
              return false;
            }

            // Check if it's a valid date
            const date = new Date(value);
            return (
              !isNaN(date.getTime()) &&
              date.toISOString().split('T')[0] === value
            );
          }

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid date`;
        },
      },
    });
  };
}

/**
 * Converts input to a Date for use in DTOs (e.g. with @Transform). Accepts YYYY-MM-DD, ISO strings, or Date.
 *
 * Process:
 * 1. If value is falsy, return null.
 * 2. If string: try YYYY-MM-DD first; else parse as ISO. Return null if invalid.
 * 3. If Date instance, return it (caller should check getTime() if needed).
 * 4. Otherwise return null.
 *
 * @param value - Raw input (string, Date, or falsy)
 * @returns Parsed Date or null if invalid/empty
 */
export function transformDateString(value: any): Date | null {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    // Handle YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(value)) {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }

    // Handle ISO 8601 format
    const isoDate = new Date(value);
    return isNaN(isoDate.getTime()) ? null : isoDate;
  }

  if (value instanceof Date) {
    return value;
  }

  return null;
}

/**
 * Formats a date as YYYY-MM-DD using the date's local year/month/day (no timezone conversion).
 * Use for display, APIs, or when you need a consistent date string.
 *
 * Process: getFullYear(), getMonth()+1, getDate(); pad month and day to 2 digits; return "YYYY-MM-DD".
 *
 * @param date - Date to format
 * @returns String in YYYY-MM-DD format
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns a Date interpreted in Philippine time (Asia/Manila). Use for audit timestamps and "today" in PH.
 *
 * Process: If date is provided and valid, output Asia/Manila's local time as Date; else use current time.
 * Warning: The resulting Date object represents the same absolute instant as in UTC, but constructed using a locale string. Use with care!
 *
 * @param date - Optional Date object; if omitted or invalid, uses current date/time
 * @returns Date object whose local time reflects Philippine timezone
 */
export function getPHDateTime(date?: Date | null): Date {
  // Always produce "now" in PH if no date is passed or it's falsy
  const baseDate =
    date instanceof Date && !isNaN(date.getTime()) ? date : new Date();
  // Get string as it appears in PH, then parse back a Date (local JS time)
  const phString = baseDate.toLocaleString('en-US', {
    timeZone: 'Asia/Manila',
  });
  return new Date(phString);
}

/**
 * Parses a year to UTC January 1st 00:00:00. Use for leave years, fiscal years, or any "start of year" logic.
 *
 * Process:
 * 1. Parse year to integer (from string or number).
 * 2. If options provided, check minYear ≤ year ≤ maxYear (default 1900–2100).
 * 3. Build Date with Date.UTC(year, 0, 1); throw if invalid.
 *
 * @param year - Year as string (e.g. "2025") or number
 * @param options - Optional { minYear, maxYear }; default 1900–2100
 * @returns Date at start of year in UTC
 * @throws Error if year is invalid or out of range
 */
export function parseYearStart(
  year: string | number,
  options?: { minYear?: number; maxYear?: number },
): Date {
  const minYear = options?.minYear ?? 1900;
  const maxYear = options?.maxYear ?? 2100;
  const y =
    typeof year === 'number'
      ? Math.floor(year)
      : parseInt(String(year).trim(), 10);
  if (!Number.isInteger(y) || y < minYear || y > maxYear) {
    throw new Error(`Year must be between ${minYear} and ${maxYear}`);
  }
  const parsed = new Date(Date.UTC(y, 0, 1));
  if (isNaN(parsed.getTime())) {
    throw new Error('Invalid year');
  }
  return parsed;
}

/**
 * Returns the number of complete calendar months between two dates (e.g. tenure, eligibility).
 * Uses UTC year/month only; returns 0 if from is after to or either date is invalid.
 *
 * Process:
 * 1. If from or to is invalid (NaN) or to < from, return 0.
 * 2. Compute (toYear - fromYear) * 12 + (toMonth - fromMonth); floor and clamp to ≥ 0.
 *
 * @param from - Start date (e.g. hire date)
 * @param to - End date (e.g. as-of date)
 * @returns Number of full months between from and to (0 if from > to or invalid)
 */
export function getCompletedMonthsBetween(from: Date, to: Date): number {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  if (isNaN(fromTime) || isNaN(toTime) || toTime < fromTime) return 0;
  const years = to.getUTCFullYear() - from.getUTCFullYear();
  const months = to.getUTCMonth() - from.getUTCMonth();
  const totalMonths = years * 12 + months;
  return Math.max(0, Math.floor(totalMonths));
}

/**
 * Returns the number of calendar days between start and end (inclusive).
 * Use for leave day counts, date-range length, or any "days in range" logic.
 *
 * Process:
 * 1. Copy start and end and set time to midnight so comparison is date-only.
 * 2. Compute difference in milliseconds between end and start (diffMs).
 * 3. Return value: Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1
 *    - (1000 * 60 * 60 * 24) = milliseconds in one day.
 *    - diffMs / msPerDay = number of 24-hour periods between the two dates (e.g. 0 for same day, 1 for next day).
 *    - Math.ceil(...) rounds up so any fractional day counts as one (and handles DST edge cases).
 *    - + 1 converts "difference in days" to "inclusive count": same day → 0 + 1 = 1; Jan 1 to Jan 2 → 1 + 1 = 2.
 *
 * @param start - First day of the range
 * @param end - Last day of the range
 * @returns Number of calendar days from start through end (inclusive)
 */
export function getCalendarDaysInclusive(start: Date, end: Date): number {
  const startNorm = new Date(start);
  const endNorm = new Date(end);
  startNorm.setHours(0, 0, 0, 0);
  endNorm.setHours(0, 0, 0, 0);
  const diffMs = endNorm.getTime() - startNorm.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Returns true if both dates are on the same calendar day (time is ignored).
 * Use for half-day leave rules, "today" checks, or grouping by day.
 *
 * Process: Compare toDateString() of both dates (normalizes to date-only string).
 *
 * @param a - First date
 * @param b - Second date
 * @returns True if same calendar day
 */
export function isSameCalendarDay(a: Date, b: Date): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
}
