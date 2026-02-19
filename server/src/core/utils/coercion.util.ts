/**
 * Coercion utilities for safely converting unknown values to primitive types.
 * Use throughout the system when reading from commands, DTOs, or external data.
 */

/**
 * Coerce unknown to number; return null if not a finite number.
 * @param value - Any value (string, number, object, etc.)
 * @returns The coerced number, or null if coercion fails
 */
export function toNumber(value: unknown): number | null {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Coerce unknown to Date; return null if invalid.
 * Accepts Date instances, ISO strings, and numeric timestamps.
 * @param value - Any value to parse as a date
 */
export function toDate(value: unknown): Date | null {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (value == null) return null;
  const d = new Date(value as string | number);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Converts a value into a lowercase string.
 * Returns undefined if the value cannot be converted.
 *
 * @param value - Any value (string, number, object, etc.)
 * @returns string (lowercased), or undefined if not convertible
 */
export function toLowerCaseString(value: unknown): string | null {
  if (typeof value === 'string') return (value as string).toLowerCase();
  return null;
}


/**
 * Converts a value into a string array (lowercased), for leave policy fields which
 * are stored as JSON arrays or comma-separated strings in the database.
  * Returns null if the value cannot be converted.
 *
 * @param value - Array<string>, JSON string, or null/undefined
 * @returns string[] (lowercased), or null if not convertible
 */
export function parseJsonArray(value: unknown): string[] | null {
  if (value == null) return null;
  if (Array.isArray(value)) {
    // Direct array; coerce and lowercase each string element, filter out undefined
    return (value as string[])
      .map((v) => toLowerCaseString(v))
      .filter((v): v is string => typeof v === 'string' && v !== null);
  }
  if (typeof value === 'string') {
    try {
      const arr = JSON.parse(value);
      return Array.isArray(arr)
        ? arr
          .map((v: unknown) => toLowerCaseString(v))
          .filter((v): v is string => typeof v === 'string' && v !== null)
        : null;
    } catch {
      // Not valid JSON -- fallback: try splitting by comma
      // (optional: depends on legacy data needs)
      // return value.split(',').map(s => toLowerCaseString(s.trim())).filter((v): v is string => typeof v === 'string');
      return null;
    }
  }
  return null;
}


/**
 * Converts a value into a number array (using toNumber), for leave policy fields which
 * are stored as JSON arrays or comma-separated strings in the database.
 * Returns null if the value cannot be converted.
 *
 * @param value - Array<number> | JSON string | null/undefined
 * @returns number[] or null if not convertible
 */
export function parseJsonNumberArray(value: unknown): number[] | null {
  if (value == null) return null;
  if (Array.isArray(value)) {
    return (value as unknown[]).map((v) => toNumber(v)).filter((v): v is number => v !== null);
  }
  if (typeof value === 'string') {
    try {
      const arr = JSON.parse(value);
      return Array.isArray(arr)
        ? arr.map((v: unknown) => toNumber(v)).filter((v): v is number => v !== null)
        : null;
    } catch {
      // Could extend for legacy comma-separated, but skip for now.
      return null;
    }
  }
  return null;
}
