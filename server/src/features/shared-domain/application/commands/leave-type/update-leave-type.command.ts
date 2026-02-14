/**
 * Command for updating a leave type
 * Application layer command - simple type definition without validation
 */
export interface UpdateLeaveTypeCommand {
  name: string;
  code: string;
  desc1: string;
  paid: boolean;
  remarks?: string;
}
