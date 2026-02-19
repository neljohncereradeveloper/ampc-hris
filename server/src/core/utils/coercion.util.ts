/**
 * Coercion utilities for safely converting unknown values to primitive types.
 * Use throughout the system when reading from commands, DTOs, or external data.
 */

/**
 * Coerce unknown to number; use default if not a finite number.
 * @param value - Any value (string, number, object, etc.)
 * @param defaultVal - Value to return when coercion fails (default 0)
 */
export function toNumber(value: unknown, defaultVal = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : defaultVal;
}

/**
 * Coerce unknown to Date; return null if invalid.
 * Accepts Date instances, ISO strings, and numeric timestamps.
 * @param value - Any value to parse as a date
 */
export function toDate(value: unknown): Date | undefined {
  if (value instanceof Date) return isNaN(value.getTime()) ? undefined : value;
  if (value == null) return undefined;
  const d = new Date(value as string | number);
  return isNaN(d.getTime()) ? undefined : d;
}

/**
 * Converts a value into a lowercase string.
 * Returns undefined if the value cannot be converted.
 *
 * @param value - Any value (string, number, object, etc.)
 * @returns string (lowercased), or undefined if not convertible
 */
export function toLowerCaseString(value: unknown): string | undefined {
  if (typeof value === 'string') return (value as string).toLowerCase();
  return undefined;
}


/**
 * Converts a value into a string array (lowercased), for leave policy fields which
 * are stored as JSON arrays or comma-separated strings in the database.
 * Returns undefined if the value cannot be converted.
 *
 * @param value - Array<string>, JSON string, or null/undefined
 * @returns string[] (lowercased), or undefined if not convertible
 */
export function parseJsonArray(value: unknown): string[] | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) {
    // Direct array; coerce and lowercase each string element, filter out undefined
    return (value as string[])
      .map((v) => toLowerCaseString(v))
      .filter((v): v is string => typeof v === 'string');
  }
  if (typeof value === 'string') {
    try {
      const arr = JSON.parse(value);
      return Array.isArray(arr)
        ? arr
          .map((v: unknown) => toLowerCaseString(v))
          .filter((v): v is string => typeof v === 'string')
        : undefined;
    } catch {
      // Not valid JSON -- fallback: try splitting by comma
      // (optional: depends on legacy data needs)
      // return value.split(',').map(s => toLowerCaseString(s.trim())).filter((v): v is string => typeof v === 'string');
      return undefined;
    }
  }
  return undefined;
}


/**
 * Converts a value into a number array (using toNumber), for leave policy fields which
 * are stored as JSON arrays or comma-separated strings in the database.
 * Returns undefined if the value cannot be converted.
 *
 * @param value - Array<number> | JSON string | null/undefined
 * @returns number[] or undefined if not convertible
 */
export function parseJsonNumberArray(value: unknown): number[] | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) {
    return (value as unknown[]).map((v) => toNumber(v));
  }
  if (typeof value === 'string') {
    try {
      const arr = JSON.parse(value);
      return Array.isArray(arr)
        ? arr.map((v: unknown) => toNumber(v))
        : undefined;
    } catch {
      // Could extend for legacy comma-separated, but skip for now.
      return undefined;
    }
  }
  return undefined;
}
