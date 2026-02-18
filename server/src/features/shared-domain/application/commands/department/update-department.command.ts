/**
 * Command for updating a department
 * Application layer command - simple type definition without validation
 */
export interface UpdateDepartmentCommand {
  desc1: string;
  code: string;
  designation: string;
  remarks?: string;
}
