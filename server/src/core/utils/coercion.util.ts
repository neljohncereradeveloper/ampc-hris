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
export function toDate(value: unknown): Date | null {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (value == null) return null;
  const d = new Date(value as string | number);
  return isNaN(d.getTime()) ? null : d;
}
