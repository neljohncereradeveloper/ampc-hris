import { DepartmentScope } from "@/features/shared-domain/domain/enum";

/**
* Command for updating a department
* Application layer command - simple type definition without validation
*/
export interface UpdateDepartmentCommand {
  desc1: string;
  code: string;
  scope: DepartmentScope;
  remarks?: string;
}
