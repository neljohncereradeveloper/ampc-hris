/**
 * Determines how payroll is grouped for this department unit.
 *
 * - HEAD_OFFICE: department belongs to head office, payroll grouped by department
 * - BRANCH: department belongs to a branch, payroll grouped by branch
 *
 * Extensible in the future (e.g. BRANCH_DEPARTMENT for big branches with own departments).
 */
export enum DepartmentScope {
  HEAD_OFFICE = 'head_office',
  BRANCH = 'branch',
}
