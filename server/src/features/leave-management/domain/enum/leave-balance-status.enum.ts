/**
 * Status of a leave balance (per employee, leave type, year).
 * Determines whether the balance can be used for new leave requests or encashment.
 */
export enum EnumLeaveBalanceStatus {
  /** Balance is in use; leave can be requested and encashed against it. */
  OPEN = 'open',
  /** Balance is closed (e.g. year-end or employee exit); no new usage. */
  CLOSED = 'closed',
  /** Balance was closed and later reopened for corrections or late processing. */
  REOPENED = 'reopened',
  /** Balance is permanently finalized (e.g. after year-end close and no further changes). */
  FINALIZED = 'finalized',
}
