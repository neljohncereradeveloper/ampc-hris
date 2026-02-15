/**
 * Command for approving a PENDING leave request.
 * "Who approved" is taken from RequestInfo.user_id (authenticated user).
 */
export interface ApproveLeaveRequestCommand {
  /** Optional remarks (e.g. approval note). */
  remarks?: string;
}
