/**
 * Command for approving, rejecting, or cancelling a leave request.
 */
export interface UpdateLeaveRequestStatusCommand {
  status: string;
  approver_id?: number;
  remarks?: string;
}
