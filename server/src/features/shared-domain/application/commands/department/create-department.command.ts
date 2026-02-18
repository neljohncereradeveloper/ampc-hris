/**
 * Command for creating a department
 * Application layer command - simple type definition without validation
 */
export interface CreateDepartmentCommand {
  desc1: string;
  code: string;
  designation: string;
  remarks?: string;
}
