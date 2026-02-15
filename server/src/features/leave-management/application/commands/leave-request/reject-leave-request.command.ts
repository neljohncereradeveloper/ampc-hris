/**
 * Command for rejecting a PENDING leave request.
 * "Who rejected" is taken from RequestInfo.user_id (authenticated user).
 */
export interface RejectLeaveRequestCommand {
  /** Optional remarks (e.g. rejection reason). */
  remarks?: string;
}
