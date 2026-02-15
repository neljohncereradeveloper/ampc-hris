import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom date validation decorator that accepts YYYY-MM-DD format
 * This decorator validates that the input is a valid date string in YYYY-MM-DD format
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
 * Date transformation utility that converts YYYY-MM-DD string to Date object
 * This can be used with @Transform decorator
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
 * Format date to YYYY-MM-DD string for display
 * Uses local date methods to avoid timezone issues
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get only the date in Philippine timezone as a Date object
 * @param date Optional date to format. If not provided, current date will be used
 * @returns Date object in Philippine timezone with time set to 00:00:00
 */
export function getPHDateTime(date?: Date): Date {
  const phDate = date ? new Date(date) : new Date();
  const phTime = new Date(
    phDate.toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
  );

  return phTime;
}

/**
 * Parse a year string or number to UTC January 1st 00:00:00.
 * @param year - Year as string (e.g. "2025") or number
 * @param options - Optional min/max year bounds (default 1900–2100). Set to undefined to skip range check.
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
 * Completed full months between two dates (calendar months, not exact days).
 * Uses UTC components. Returns 0 if from > to or either date is invalid.
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
 * Calendar days between start and end (inclusive).
 * Times are normalized to midnight for comparison.
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
 * Whether two dates fall on the same calendar day (ignoring time).
 */
export function isSameCalendarDay(a: Date, b: Date): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
}
