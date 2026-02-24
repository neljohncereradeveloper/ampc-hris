import { DepartmentScope } from '@/features/shared-domain/domain/enum';

/**
 * Command for creating a department
 * Application layer command - simple type definition without validation
 */
export interface CreateDepartmentCommand {
  desc1: string;
  code: string;
  scope: DepartmentScope;
  remarks?: string;
}
