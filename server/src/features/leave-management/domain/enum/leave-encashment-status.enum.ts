/**
 * Status of a leave encashment (converting unused leave days to pay).
 * Tracks the request from submission through payment or cancellation.
 */
export enum EnumLeaveEncashmentStatus {
  /** Encashment is submitted and awaiting payment processing. */
  PENDING = 'pending',
  /** Encashment has been paid (e.g. included in payroll). */
  PAID = 'paid',
  /** Encashment was cancelled; balance is restored, no payment. */
  CANCELLED = 'cancelled',
}
