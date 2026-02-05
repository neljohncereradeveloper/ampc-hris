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
  COMBOBOX: 'combobox',
  PAGINATED_LIST: 'paginated_list',
  ASSIGN_PERMISSIONS: 'assign_permissions',
  CHANGE_PASSWORD: 'change_password',
  VERIFY_EMAIL: 'verify_email',
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
  BRANCHES: 'branches',
  DEPARTMENTS: 'departments',
  JOBTITLES: 'jobtitles',
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.ROLES,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.ROLES,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.PERMISSIONS,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.PERMISSIONS,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.USERS,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.USERS,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.HOLIDAYS,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.HOLIDAYS,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.BARANGAYS,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.BARANGAYS,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.CITIES,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.CITIES,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.CITIZENSHIPS,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.CITIZENSHIPS,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.CIVIL_STATUSES,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.CIVIL_STATUSES,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.PROVINCES,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.PROVINCES,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.RELIGIONS,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.RELIGIONS,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.BRANCHES,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.BRANCHES,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.DEPARTMENTS,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.DEPARTMENTS,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    COMBOBOX: buildPermissionName(
      PERMISSION_RESOURCES.JOBTITLES,
      PERMISSION_ACTIONS.COMBOBOX,
    ),
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.JOBTITLES,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
    PAGINATED_LIST: buildPermissionName(
      PERMISSION_RESOURCES.EMPLOYEES,
      PERMISSION_ACTIONS.PAGINATED_LIST,
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
