/**
 * Status of a leave cycle (e.g. employee leave cycle tied to tenure or policy).
 * Used to track whether the cycle is currently in effect or has ended.
 */
export enum EnumLeaveCycleStatus {
  /** Cycle is currently in effect; balances and requests can be tied to it. */
  ACTIVE = 'active',
  /** Cycle has ended (e.g. cycle end year reached); no new activity. */
  COMPLETED = 'completed',
}
