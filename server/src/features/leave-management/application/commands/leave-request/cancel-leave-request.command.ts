/**
 * Command for cancelling a leave request (PENDING or APPROVED).
 * "Who cancelled" is taken from RequestInfo.user_id when set by the API; otherwise the request's employee_id.
 */
export interface CancelLeaveRequestCommand {
  /** Optional remarks (e.g. cancellation reason). */
  remarks?: string;
}
