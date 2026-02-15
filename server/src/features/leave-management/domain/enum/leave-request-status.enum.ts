/**
 * Status of a leave request (employee application for leave).
 * Lifecycle: PENDING → APPROVED or REJECTED or CANCELLED.
 */
export enum EnumLeaveRequestStatus {
  /** Request submitted; awaiting manager approval or rejection. */
  PENDING = 'pending',
  /** Request approved; balance is debited, leave is granted. */
  APPROVED = 'approved',
  /** Request rejected by approver; no balance change. */
  REJECTED = 'rejected',
  /** Request cancelled (by employee or HR); if was APPROVED, balance is reversed. */
  CANCELLED = 'cancelled',
}
