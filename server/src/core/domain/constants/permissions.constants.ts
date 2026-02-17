/**
 * Permission Constants
 *
 * Centralized constants for permissions used throughout the application.
 * Permissions follow the pattern: <resource>:<action>
 *
 * This ensures consistency and makes it easier to maintain permission usage
 * across features and controllers.
 */

/**
 * Standard permission actions
 * These actions are reused across multiple resources
 */
export const PERMISSION_ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  ARCHIVE: 'archive',
  RESTORE: 'restore',
  ASSIGN_PERMISSIONS: 'assign_permissions',
  CHANGE_PASSWORD: 'change_password',
  VERIFY_EMAIL: 'verify_email',
  // EMPLOYEE ACTIONS
  UPDATE_IMAGE_PATH: 'update_image_path',
  UPDATE_GOVERNMENT_DETAILS: 'update_government_details',
  UPDATE_SALARY_DETAILS: 'update_salary_details',
  UPDATE_BANK_DETAILS: 'update_bank_details',
  // Leave management (aligned with use cases)
  APPROVE: 'approve',
  REJECT: 'reject',
  CANCEL: 'cancel',
  MARK_AS_PAID: 'mark_as_paid',
  ACTIVATE: 'activate',
  RETIRE: 'retire',
  CLOSE: 'close',
  CLOSE_BALANCES_FOR_EMPLOYEE: 'close_balances_for_employee',
  RESET_FOR_YEAR: 'reset_for_year',
  GENERATE_BALANCES_FOR_ALL_EMPLOYEES: 'generate_balances_for_all_employees',
} as const;

/**
 * Permission resources
 * These are the feature/domain resources that permissions apply to
 */
export const PERMISSION_RESOURCES = {
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  USERS: 'users',
  USER_ROLES: 'user-roles',
  USER_PERMISSIONS: 'user-permissions',
  ROLE_PERMISSIONS: 'role-permissions',
  HOLIDAYS: 'holidays',
  BARANGAYS: 'barangays',
  CITIES: 'cities',
  CITIZENSHIPS: 'citizenships',
  CIVIL_STATUSES: 'civil-statuses',
  EMPLOYMENT_TYPES: 'employment-types',
  EMPLOYMENT_STATUSES: 'employment-statuses',
  PROVINCES: 'provinces',
  RELIGIONS: 'religions',
  REFERENCES: 'references',
  TRAINING_CERTIFICATES: 'training-certificates',
  TRAININGS: 'trainings',
  WORK_EXPERIENCE_COMPANIES: 'work-experience-companies',
  WORK_EXPERIENCE_JOBTITLES: 'work-experience-jobtitles',
  WORK_EXPERIENCES: 'work-experiences',
  EDUCATION_COURSE_LEVELS: 'education-course-levels',
  EDUCATION_COURSES: 'education-courses',
  EDUCATION_LEVELS: 'education-levels',
  EDUCATION_SCHOOLS: 'education-schools',
  EDUCATIONS: 'educations',
  BRANCHES: 'branches',
  DEPARTMENTS: 'departments',
  JOBTITLES: 'jobtitles',
  LEAVE_TYPES: 'leave-types',
  LEAVE_POLICIES: 'leave-policies',
  LEAVE_REQUESTS: 'leave-requests',
  LEAVE_BALANCES: 'leave-balances',
  LEAVE_ENCASHMENTS: 'leave-encashments',
  LEAVE_YEAR_CONFIGURATIONS: 'leave-year-configurations',
  EMPLOYEES: 'employees',
} as const;

/**
 * Helper function to build permission name
 * @param resource The resource name
 * @param action The action name
 * @returns Permission name in format "resource:action"
 */
export function buildPermissionName(resource: string, action: string): string {
  return `${resource}:${action}`;
}

/**
 * Pre-built permission constants for common resources
 * These are the standard permissions used across features
 */
export const PERMISSIONS = {
  // Role permissions
  // Note: CREATE, UPDATE, ARCHIVE, RESTORE, ASSIGN_PERMISSIONS removed - roles are statically defined
  // (Admin, Editor, Viewer) and managed via seeders only
  ROLES: {
    READ: buildPermissionName(
      PERMISSION_RESOURCES.ROLES,
      PERMISSION_ACTIONS.READ,
    ),
  },
  // Permission permissions
  // Note: CREATE, UPDATE, ARCHIVE, RESTORE removed - permissions are statically defined
  // and managed via seeders only
  PERMISSIONS: {
    READ: buildPermissionName(
      PERMISSION_RESOURCES.PERMISSIONS,
      PERMISSION_ACTIONS.READ,
    ),

  },
  // User permissions
  USERS: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.USERS,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.USERS,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.USERS,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.USERS,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.USERS,
      PERMISSION_ACTIONS.RESTORE,
    ),
    CHANGE_PASSWORD: buildPermissionName(
      PERMISSION_RESOURCES.USERS,
      PERMISSION_ACTIONS.CHANGE_PASSWORD,
    ),
    VERIFY_EMAIL: buildPermissionName(
      PERMISSION_RESOURCES.USERS,
      PERMISSION_ACTIONS.VERIFY_EMAIL,
    ),
  },
  // Holiday permissions
  HOLIDAYS: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.HOLIDAYS,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.HOLIDAYS,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.HOLIDAYS,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.HOLIDAYS,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.HOLIDAYS,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Barangay permissions (201-management)
  BARANGAYS: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.BARANGAYS,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.BARANGAYS,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.BARANGAYS,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.BARANGAYS,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.BARANGAYS,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // City permissions (201-management)
  CITIES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.CITIES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.CITIES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.CITIES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.CITIES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.CITIES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Citizenship permissions (201-management)
  CITIZENSHIPS: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.CITIZENSHIPS,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.CITIZENSHIPS,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.CITIZENSHIPS,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.CITIZENSHIPS,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.CITIZENSHIPS,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Civil Status permissions (201-management)
  CIVIL_STATUSES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.CIVIL_STATUSES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.CIVIL_STATUSES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.CIVIL_STATUSES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.CIVIL_STATUSES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.CIVIL_STATUSES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Employment Type permissions (201-management)
  EMPLOYMENT_TYPES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Employment Status permissions (201-management)
  EMPLOYMENT_STATUSES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Province permissions (201-management)
  PROVINCES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.PROVINCES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.PROVINCES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.PROVINCES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.PROVINCES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.PROVINCES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Religion permissions (201-management)
  RELIGIONS: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.RELIGIONS,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.RELIGIONS,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.RELIGIONS,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.RELIGIONS,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.RELIGIONS,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Reference permissions (201-management)
  REFERENCES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.REFERENCES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.REFERENCES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.REFERENCES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.REFERENCES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.REFERENCES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Training Certificate permissions (201-management)
  TRAINING_CERTIFICATES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.TRAINING_CERTIFICATES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.TRAINING_CERTIFICATES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.TRAINING_CERTIFICATES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.TRAINING_CERTIFICATES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.TRAINING_CERTIFICATES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Training permissions (201-management)
  TRAININGS: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.TRAININGS,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.TRAININGS,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.TRAININGS,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.TRAININGS,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.TRAININGS,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Work Experience Company permissions (201-management)
  WORK_EXPERIENCE_COMPANIES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCE_COMPANIES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCE_COMPANIES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCE_COMPANIES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCE_COMPANIES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCE_COMPANIES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Work Experience Job Title permissions (201-management)
  WORK_EXPERIENCE_JOBTITLES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCE_JOBTITLES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCE_JOBTITLES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCE_JOBTITLES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCE_JOBTITLES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCE_JOBTITLES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Work Experience permissions (201-management)
  WORK_EXPERIENCES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.WORK_EXPERIENCES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Education Course Level permissions (201-management)
  EDUCATION_COURSE_LEVELS: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_COURSE_LEVELS,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_COURSE_LEVELS,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_COURSE_LEVELS,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_COURSE_LEVELS,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_COURSE_LEVELS,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Education Course permissions (201-management)
  EDUCATION_COURSES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_COURSES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_COURSES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_COURSES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_COURSES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_COURSES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Education Level permissions (201-management)
  EDUCATION_LEVELS: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_LEVELS,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_LEVELS,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_LEVELS,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_LEVELS,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_LEVELS,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Education School permissions (201-management)
  EDUCATION_SCHOOLS: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_SCHOOLS,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_SCHOOLS,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_SCHOOLS,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_SCHOOLS,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATION_SCHOOLS,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Education permissions (201-management - employee education records)
  EDUCATIONS: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATIONS,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATIONS,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATIONS,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATIONS,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.EDUCATIONS,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Branch permissions (core - shared across features)
  BRANCHES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.BRANCHES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.BRANCHES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.BRANCHES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.BRANCHES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.BRANCHES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Department permissions (shared-domain)
  DEPARTMENTS: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.DEPARTMENTS,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.DEPARTMENTS,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.DEPARTMENTS,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.DEPARTMENTS,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.DEPARTMENTS,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Jobtitle permissions (shared-domain)
  JOBTITLES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.JOBTITLES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.JOBTITLES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.JOBTITLES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.JOBTITLES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.JOBTITLES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Leave type permissions (shared-domain)
  LEAVE_TYPES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_TYPES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_TYPES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_TYPES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_TYPES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_TYPES,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // // Leave policy permissions (leave-management; strictly 1:1 with use cases)
  LEAVE_POLICIES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_POLICIES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_POLICIES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_POLICIES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_POLICIES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_POLICIES,
      PERMISSION_ACTIONS.RESTORE,
    ),
    ACTIVATE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_POLICIES,
      PERMISSION_ACTIONS.ACTIVATE,
    ),
    RETIRE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_POLICIES,
      PERMISSION_ACTIONS.RETIRE,
    ),
  },
  // // Leave request permissions (leave-management; aligned with use cases)
  // LEAVE_REQUESTS: {
  //   CREATE: buildPermissionName(
  //     PERMISSION_RESOURCES.LEAVE_REQUESTS,
  //     PERMISSION_ACTIONS.CREATE,
  //   ),
  //   READ: buildPermissionName(
  //     PERMISSION_RESOURCES.LEAVE_REQUESTS,
  //     PERMISSION_ACTIONS.READ,
  //   ),
  //   UPDATE: buildPermissionName(
  //     PERMISSION_RESOURCES.LEAVE_REQUESTS,
  //     PERMISSION_ACTIONS.UPDATE,
  //   ),
  //   APPROVE: buildPermissionName(
  //     PERMISSION_RESOURCES.LEAVE_REQUESTS,
  //     PERMISSION_ACTIONS.APPROVE,
  //   ),
  //   REJECT: buildPermissionName(
  //     PERMISSION_RESOURCES.LEAVE_REQUESTS,
  //     PERMISSION_ACTIONS.REJECT,
  //   ),
  //   CANCEL: buildPermissionName(
  //     PERMISSION_RESOURCES.LEAVE_REQUESTS,
  //     PERMISSION_ACTIONS.CANCEL,
  //   ),
  // },
  // // Leave balance permissions (leave-management; aligned with use cases)
  LEAVE_BALANCES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_BALANCES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_BALANCES,
      PERMISSION_ACTIONS.READ,
    ),
    CLOSE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_BALANCES,
      PERMISSION_ACTIONS.CLOSE,
    ),
    CLOSE_BALANCES_FOR_EMPLOYEE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_BALANCES,
      PERMISSION_ACTIONS.CLOSE_BALANCES_FOR_EMPLOYEE,
    ),
    GENERATE_BALANCES_FOR_ALL_EMPLOYEES: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_BALANCES,
      PERMISSION_ACTIONS.GENERATE_BALANCES_FOR_ALL_EMPLOYEES,
    ),
    RESET_FOR_YEAR: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_BALANCES,
      PERMISSION_ACTIONS.RESET_FOR_YEAR,
    ),
  },
  // // Leave encashment permissions (leave-management; strictly 1:1 with use cases)
  // LEAVE_ENCASHMENTS: {
  //   CREATE: buildPermissionName(
  //     PERMISSION_RESOURCES.LEAVE_ENCASHMENTS,
  //     PERMISSION_ACTIONS.CREATE,
  //   ),
  //   MARK_AS_PAID: buildPermissionName(
  //     PERMISSION_RESOURCES.LEAVE_ENCASHMENTS,
  //     PERMISSION_ACTIONS.MARK_AS_PAID,
  //   ),
  // },
  // Leave year configuration permissions (leave-management; strictly 1:1 with use cases)
  LEAVE_YEAR_CONFIGURATIONS: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_YEAR_CONFIGURATIONS,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_YEAR_CONFIGURATIONS,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_YEAR_CONFIGURATIONS,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_YEAR_CONFIGURATIONS,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.LEAVE_YEAR_CONFIGURATIONS,
      PERMISSION_ACTIONS.RESTORE,
    ),
  },
  // Employee permissions (shared-domain)
  EMPLOYEES: {
    CREATE: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYEES,
      PERMISSION_ACTIONS.CREATE,
    ),
    READ: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYEES,
      PERMISSION_ACTIONS.READ,
    ),
    UPDATE: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYEES,
      PERMISSION_ACTIONS.UPDATE,
    ),
    ARCHIVE: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYEES,
      PERMISSION_ACTIONS.ARCHIVE,
    ),
    RESTORE: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYEES,
      PERMISSION_ACTIONS.RESTORE,
    ),
    UPDATE_IMAGE_PATH: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYEES,
      PERMISSION_ACTIONS.UPDATE_IMAGE_PATH,
    ),
    UPDATE_GOVERNMENT_DETAILS: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYEES,
      PERMISSION_ACTIONS.UPDATE_GOVERNMENT_DETAILS,
    ),
    UPDATE_SALARY_DETAILS: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYEES,
      PERMISSION_ACTIONS.UPDATE_SALARY_DETAILS,
    ),
    UPDATE_BANK_DETAILS: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYEES,
      PERMISSION_ACTIONS.UPDATE_BANK_DETAILS,
    ),
  },
  // User-Role permissions
  USER_ROLES: {
    READ: buildPermissionName(
      PERMISSION_RESOURCES.USER_ROLES,
      PERMISSION_ACTIONS.READ,
    ),
    ASSIGN_ROLES: buildPermissionName(
      PERMISSION_RESOURCES.USER_ROLES,
      'assign_roles',
    ),
    REMOVE_ROLES: buildPermissionName(
      PERMISSION_RESOURCES.USER_ROLES,
      'remove_roles',
    ),
  },
  // User-Permission permissions
  USER_PERMISSIONS: {
    READ: buildPermissionName(
      PERMISSION_RESOURCES.USER_PERMISSIONS,
      PERMISSION_ACTIONS.READ,
    ),
    GRANT_PERMISSIONS: buildPermissionName(
      PERMISSION_RESOURCES.USER_PERMISSIONS,
      'grant_permissions',
    ),
    DENY_PERMISSIONS: buildPermissionName(
      PERMISSION_RESOURCES.USER_PERMISSIONS,
      'deny_permissions',
    ),
    REMOVE_OVERRIDES: buildPermissionName(
      PERMISSION_RESOURCES.USER_PERMISSIONS,
      'remove_overrides',
    ),
  },
} as const;

/**
 * Type for permission action names
 */
export type PermissionAction =
  (typeof PERMISSION_ACTIONS)[keyof typeof PERMISSION_ACTIONS];

/**
 * Type for permission resource names
 */
export type PermissionResource =
  (typeof PERMISSION_RESOURCES)[keyof typeof PERMISSION_RESOURCES];
