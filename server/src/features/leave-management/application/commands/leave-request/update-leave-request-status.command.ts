/**
 * Command for approving, rejecting, or cancelling a leave request.
 */
export interface UpdateLeaveRequestStatusCommand {
  /** New status: e.g. "approved", "rejected", "cancelled". */
  status: string;
  /** User/approver ID who performed the action (optional). */
  approver_id?: number;
  /** Optional remarks (e.g. rejection reason). */
  remarks?: string;
}
