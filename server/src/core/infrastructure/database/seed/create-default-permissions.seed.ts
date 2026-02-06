import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { PermissionEntity } from '@/features/rbac/infrastructure/database/entities/permission.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import {
  PERMISSIONS,
  PERMISSION_RESOURCES,
  PERMISSION_ACTIONS,
} from '@/core/domain/constants';

/**
 * SeedPermissions
 *
 * This seed class populates the permissions table with default permission values.
 *
 * PURPOSE:
 * Permissions define specific capabilities on resources (e.g., users:create, roles:read).
 * They are the foundation of the RBAC system and are assigned to roles.
 *
 * USAGE:
 * This seed creates default permissions for common resources and actions:
 * - Roles: create, read, update, archive, restore, assign_permissions, remove_permissions, combobox, paginated_list
 * - Permissions: create, read, update, archive, restore, combobox, paginated_list
 * - Users: create, read, update, archive, restore, change_password, verify_email, combobox, paginated_list
 * - Holidays: create, read, update, archive, restore, combobox, paginated_list
 *
 * NOTE:
 * The seed is idempotent - running it multiple times will not create duplicates.
 * Permissions are checked by their unique name field.
 */
export class SeedPermissions {
  private readonly logger = new Logger(SeedPermissions.name);

  constructor(private readonly entityManager: EntityManager) { }

  /**
   * Executes the seed operation to create default permission entries.
   *
   * This method:
   * 1. Defines default permissions for common resources and actions
   * 2. Checks if each permission already exists in the database (by name)
   * 3. Creates new permission records only if they don't exist (idempotent operation)
   * 4. Logs the creation or existence of each permission
   *
   * The seed is idempotent - running it multiple times will not create duplicates.
   */
  async run(): Promise<Map<string, number>> {
    /**
     * Default permission entries.
     * Format: { name, resource, action, description }
     */
    const permissions = [
      // Role permissions
      // Note: CREATE, UPDATE, ARCHIVE, RESTORE, ASSIGN_PERMISSIONS removed - roles are statically defined
      // (Admin, Editor, Viewer) and managed via seeders only
      {
        name: PERMISSIONS.ROLES.READ,
        resource: PERMISSION_RESOURCES.ROLES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View role details',
      },
      {
        name: PERMISSIONS.ROLES.COMBOBOX,
        resource: PERMISSION_RESOURCES.ROLES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get roles list for dropdowns',
      },
      {
        name: PERMISSIONS.ROLES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.ROLES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of roles',
      },
      // Permission permissions
      // Note: CREATE, UPDATE, ARCHIVE, RESTORE removed - permissions are statically defined
      // and managed via seeders only
      {
        name: PERMISSIONS.PERMISSIONS.READ,
        resource: PERMISSION_RESOURCES.PERMISSIONS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View permission details',
      },
      {
        name: PERMISSIONS.PERMISSIONS.COMBOBOX,
        resource: PERMISSION_RESOURCES.PERMISSIONS,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get permissions list for dropdowns',
      },
      {
        name: PERMISSIONS.PERMISSIONS.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.PERMISSIONS,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of permissions',
      },
      // User permissions
      {
        name: PERMISSIONS.USERS.CREATE,
        resource: PERMISSION_RESOURCES.USERS,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new users',
      },
      {
        name: PERMISSIONS.USERS.READ,
        resource: PERMISSION_RESOURCES.USERS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View user details',
      },
      {
        name: PERMISSIONS.USERS.UPDATE,
        resource: PERMISSION_RESOURCES.USERS,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update user information',
      },
      {
        name: PERMISSIONS.USERS.ARCHIVE,
        resource: PERMISSION_RESOURCES.USERS,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) users',
      },
      {
        name: PERMISSIONS.USERS.RESTORE,
        resource: PERMISSION_RESOURCES.USERS,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived users',
      },
      {
        name: PERMISSIONS.USERS.CHANGE_PASSWORD,
        resource: PERMISSION_RESOURCES.USERS,
        action: PERMISSION_ACTIONS.CHANGE_PASSWORD,
        description: 'Change user passwords',
      },
      {
        name: PERMISSIONS.USERS.VERIFY_EMAIL,
        resource: PERMISSION_RESOURCES.USERS,
        action: PERMISSION_ACTIONS.VERIFY_EMAIL,
        description: 'Verify user email addresses',
      },
      {
        name: PERMISSIONS.USERS.COMBOBOX,
        resource: PERMISSION_RESOURCES.USERS,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get users list for dropdowns',
      },
      {
        name: PERMISSIONS.USERS.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.USERS,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of users',
      },
      // User-Role permissions
      {
        name: PERMISSIONS.USER_ROLES.READ,
        resource: PERMISSION_RESOURCES.USER_ROLES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View user role assignments',
      },
      {
        name: PERMISSIONS.USER_ROLES.ASSIGN_ROLES,
        resource: PERMISSION_RESOURCES.USER_ROLES,
        action: 'assign_roles',
        description: 'Assign roles to users',
      },
      {
        name: PERMISSIONS.USER_ROLES.REMOVE_ROLES,
        resource: PERMISSION_RESOURCES.USER_ROLES,
        action: 'remove_roles',
        description: 'Remove roles from users',
      },
      // User-Permission permissions
      {
        name: PERMISSIONS.USER_PERMISSIONS.READ,
        resource: PERMISSION_RESOURCES.USER_PERMISSIONS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View user permission overrides',
      },
      {
        name: PERMISSIONS.USER_PERMISSIONS.GRANT_PERMISSIONS,
        resource: PERMISSION_RESOURCES.USER_PERMISSIONS,
        action: 'grant_permissions',
        description: 'Grant permissions directly to users',
      },
      {
        name: PERMISSIONS.USER_PERMISSIONS.DENY_PERMISSIONS,
        resource: PERMISSION_RESOURCES.USER_PERMISSIONS,
        action: 'deny_permissions',
        description: 'Deny permissions directly to users',
      },
      {
        name: PERMISSIONS.USER_PERMISSIONS.REMOVE_OVERRIDES,
        resource: PERMISSION_RESOURCES.USER_PERMISSIONS,
        action: 'remove_overrides',
        description: 'Remove permission overrides from users',
      },
      // Holiday permissions
      {
        name: PERMISSIONS.HOLIDAYS.CREATE,
        resource: PERMISSION_RESOURCES.HOLIDAYS,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new holidays',
      },
      {
        name: PERMISSIONS.HOLIDAYS.READ,
        resource: PERMISSION_RESOURCES.HOLIDAYS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View holiday details',
      },
      {
        name: PERMISSIONS.HOLIDAYS.UPDATE,
        resource: PERMISSION_RESOURCES.HOLIDAYS,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update holiday information',
      },
      {
        name: PERMISSIONS.HOLIDAYS.ARCHIVE,
        resource: PERMISSION_RESOURCES.HOLIDAYS,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) holidays',
      },
      {
        name: PERMISSIONS.HOLIDAYS.RESTORE,
        resource: PERMISSION_RESOURCES.HOLIDAYS,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived holidays',
      },
      {
        name: PERMISSIONS.HOLIDAYS.COMBOBOX,
        resource: PERMISSION_RESOURCES.HOLIDAYS,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get holidays list for dropdowns',
      },
      {
        name: PERMISSIONS.HOLIDAYS.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.HOLIDAYS,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of holidays',
      },
      // Barangay permissions (201-management)
      {
        name: PERMISSIONS.BARANGAYS.CREATE,
        resource: PERMISSION_RESOURCES.BARANGAYS,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new barangays',
      },
      {
        name: PERMISSIONS.BARANGAYS.READ,
        resource: PERMISSION_RESOURCES.BARANGAYS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View barangay details',
      },
      {
        name: PERMISSIONS.BARANGAYS.UPDATE,
        resource: PERMISSION_RESOURCES.BARANGAYS,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update barangay information',
      },
      {
        name: PERMISSIONS.BARANGAYS.ARCHIVE,
        resource: PERMISSION_RESOURCES.BARANGAYS,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) barangays',
      },
      {
        name: PERMISSIONS.BARANGAYS.RESTORE,
        resource: PERMISSION_RESOURCES.BARANGAYS,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived barangays',
      },
      {
        name: PERMISSIONS.BARANGAYS.COMBOBOX,
        resource: PERMISSION_RESOURCES.BARANGAYS,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get barangays list for dropdowns',
      },
      {
        name: PERMISSIONS.BARANGAYS.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.BARANGAYS,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of barangays',
      },
      // City permissions (201-management)
      {
        name: PERMISSIONS.CITIES.CREATE,
        resource: PERMISSION_RESOURCES.CITIES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new cities',
      },
      {
        name: PERMISSIONS.CITIES.READ,
        resource: PERMISSION_RESOURCES.CITIES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View city details',
      },
      {
        name: PERMISSIONS.CITIES.UPDATE,
        resource: PERMISSION_RESOURCES.CITIES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update city information',
      },
      {
        name: PERMISSIONS.CITIES.ARCHIVE,
        resource: PERMISSION_RESOURCES.CITIES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) cities',
      },
      {
        name: PERMISSIONS.CITIES.RESTORE,
        resource: PERMISSION_RESOURCES.CITIES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived cities',
      },
      {
        name: PERMISSIONS.CITIES.COMBOBOX,
        resource: PERMISSION_RESOURCES.CITIES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get cities list for dropdowns',
      },
      {
        name: PERMISSIONS.CITIES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.CITIES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of cities',
      },
      // Citizenship permissions (201-management)
      {
        name: PERMISSIONS.CITIZENSHIPS.CREATE,
        resource: PERMISSION_RESOURCES.CITIZENSHIPS,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new citizenships',
      },
      {
        name: PERMISSIONS.CITIZENSHIPS.READ,
        resource: PERMISSION_RESOURCES.CITIZENSHIPS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View citizenship details',
      },
      {
        name: PERMISSIONS.CITIZENSHIPS.UPDATE,
        resource: PERMISSION_RESOURCES.CITIZENSHIPS,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update citizenship information',
      },
      {
        name: PERMISSIONS.CITIZENSHIPS.ARCHIVE,
        resource: PERMISSION_RESOURCES.CITIZENSHIPS,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) citizenships',
      },
      {
        name: PERMISSIONS.CITIZENSHIPS.RESTORE,
        resource: PERMISSION_RESOURCES.CITIZENSHIPS,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived citizenships',
      },
      {
        name: PERMISSIONS.CITIZENSHIPS.COMBOBOX,
        resource: PERMISSION_RESOURCES.CITIZENSHIPS,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get citizenships list for dropdowns',
      },
      {
        name: PERMISSIONS.CITIZENSHIPS.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.CITIZENSHIPS,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of citizenships',
      },
      // Civil Status permissions (201-management)
      {
        name: PERMISSIONS.CIVIL_STATUSES.CREATE,
        resource: PERMISSION_RESOURCES.CIVIL_STATUSES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new civil statuses',
      },
      {
        name: PERMISSIONS.CIVIL_STATUSES.READ,
        resource: PERMISSION_RESOURCES.CIVIL_STATUSES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View civil status details',
      },
      {
        name: PERMISSIONS.CIVIL_STATUSES.UPDATE,
        resource: PERMISSION_RESOURCES.CIVIL_STATUSES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update civil status information',
      },
      {
        name: PERMISSIONS.CIVIL_STATUSES.ARCHIVE,
        resource: PERMISSION_RESOURCES.CIVIL_STATUSES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) civil statuses',
      },
      {
        name: PERMISSIONS.CIVIL_STATUSES.RESTORE,
        resource: PERMISSION_RESOURCES.CIVIL_STATUSES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived civil statuses',
      },
      {
        name: PERMISSIONS.CIVIL_STATUSES.COMBOBOX,
        resource: PERMISSION_RESOURCES.CIVIL_STATUSES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get civil statuses list for dropdowns',
      },
      {
        name: PERMISSIONS.CIVIL_STATUSES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.CIVIL_STATUSES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of civil statuses',
      },
      // Employment Type permissions (201-management)
      {
        name: PERMISSIONS.EMPLOYMENT_TYPES.CREATE,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new employment types',
      },
      {
        name: PERMISSIONS.EMPLOYMENT_TYPES.READ,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View employment type details',
      },
      {
        name: PERMISSIONS.EMPLOYMENT_TYPES.UPDATE,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update employment type information',
      },
      {
        name: PERMISSIONS.EMPLOYMENT_TYPES.ARCHIVE,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) employment types',
      },
      {
        name: PERMISSIONS.EMPLOYMENT_TYPES.RESTORE,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived employment types',
      },
      {
        name: PERMISSIONS.EMPLOYMENT_TYPES.COMBOBOX,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get employment types list for dropdowns',
      },
      {
        name: PERMISSIONS.EMPLOYMENT_TYPES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_TYPES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of employment types',
      },
      // Employment Status permissions (201-management)
      {
        name: PERMISSIONS.EMPLOYMENT_STATUSES.CREATE,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new employment statuses',
      },
      {
        name: PERMISSIONS.EMPLOYMENT_STATUSES.READ,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View employment status details',
      },
      {
        name: PERMISSIONS.EMPLOYMENT_STATUSES.UPDATE,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update employment status information',
      },
      {
        name: PERMISSIONS.EMPLOYMENT_STATUSES.ARCHIVE,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) employment statuses',
      },
      {
        name: PERMISSIONS.EMPLOYMENT_STATUSES.RESTORE,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived employment statuses',
      },
      {
        name: PERMISSIONS.EMPLOYMENT_STATUSES.COMBOBOX,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get employment statuses list for dropdowns',
      },
      {
        name: PERMISSIONS.EMPLOYMENT_STATUSES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.EMPLOYMENT_STATUSES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of employment statuses',
      },
      // Province permissions (201-management)
      {
        name: PERMISSIONS.PROVINCES.CREATE,
        resource: PERMISSION_RESOURCES.PROVINCES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new provinces',
      },
      {
        name: PERMISSIONS.PROVINCES.READ,
        resource: PERMISSION_RESOURCES.PROVINCES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View province details',
      },
      {
        name: PERMISSIONS.PROVINCES.UPDATE,
        resource: PERMISSION_RESOURCES.PROVINCES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update province information',
      },
      {
        name: PERMISSIONS.PROVINCES.ARCHIVE,
        resource: PERMISSION_RESOURCES.PROVINCES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) provinces',
      },
      {
        name: PERMISSIONS.PROVINCES.RESTORE,
        resource: PERMISSION_RESOURCES.PROVINCES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived provinces',
      },
      {
        name: PERMISSIONS.PROVINCES.COMBOBOX,
        resource: PERMISSION_RESOURCES.PROVINCES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get provinces list for dropdowns',
      },
      {
        name: PERMISSIONS.PROVINCES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.PROVINCES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of provinces',
      },
      // Religion permissions (201-management)
      {
        name: PERMISSIONS.RELIGIONS.CREATE,
        resource: PERMISSION_RESOURCES.RELIGIONS,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new religions',
      },
      {
        name: PERMISSIONS.RELIGIONS.READ,
        resource: PERMISSION_RESOURCES.RELIGIONS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View religion details',
      },
      {
        name: PERMISSIONS.RELIGIONS.UPDATE,
        resource: PERMISSION_RESOURCES.RELIGIONS,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update religion information',
      },
      {
        name: PERMISSIONS.RELIGIONS.ARCHIVE,
        resource: PERMISSION_RESOURCES.RELIGIONS,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) religions',
      },
      {
        name: PERMISSIONS.RELIGIONS.RESTORE,
        resource: PERMISSION_RESOURCES.RELIGIONS,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived religions',
      },
      {
        name: PERMISSIONS.RELIGIONS.COMBOBOX,
        resource: PERMISSION_RESOURCES.RELIGIONS,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get religions list for dropdowns',
      },
      {
        name: PERMISSIONS.RELIGIONS.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.RELIGIONS,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of religions',
      },
      // Reference permissions (201-management)
      {
        name: PERMISSIONS.REFERENCES.CREATE,
        resource: PERMISSION_RESOURCES.REFERENCES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new references',
      },
      {
        name: PERMISSIONS.REFERENCES.READ,
        resource: PERMISSION_RESOURCES.REFERENCES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View reference details',
      },
      {
        name: PERMISSIONS.REFERENCES.UPDATE,
        resource: PERMISSION_RESOURCES.REFERENCES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update reference information',
      },
      {
        name: PERMISSIONS.REFERENCES.ARCHIVE,
        resource: PERMISSION_RESOURCES.REFERENCES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) references',
      },
      {
        name: PERMISSIONS.REFERENCES.RESTORE,
        resource: PERMISSION_RESOURCES.REFERENCES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived references',
      },
      {
        name: PERMISSIONS.REFERENCES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.REFERENCES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of references',
      },
      // Training Certificate permissions (201-management)
      {
        name: PERMISSIONS.TRAINING_CERTIFICATES.CREATE,
        resource: PERMISSION_RESOURCES.TRAINING_CERTIFICATES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new training certificates',
      },
      {
        name: PERMISSIONS.TRAINING_CERTIFICATES.READ,
        resource: PERMISSION_RESOURCES.TRAINING_CERTIFICATES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View training certificate details',
      },
      {
        name: PERMISSIONS.TRAINING_CERTIFICATES.UPDATE,
        resource: PERMISSION_RESOURCES.TRAINING_CERTIFICATES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update training certificate information',
      },
      {
        name: PERMISSIONS.TRAINING_CERTIFICATES.ARCHIVE,
        resource: PERMISSION_RESOURCES.TRAINING_CERTIFICATES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) training certificates',
      },
      {
        name: PERMISSIONS.TRAINING_CERTIFICATES.RESTORE,
        resource: PERMISSION_RESOURCES.TRAINING_CERTIFICATES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived training certificates',
      },
      {
        name: PERMISSIONS.TRAINING_CERTIFICATES.COMBOBOX,
        resource: PERMISSION_RESOURCES.TRAINING_CERTIFICATES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get training certificates list for dropdowns',
      },
      {
        name: PERMISSIONS.TRAINING_CERTIFICATES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.TRAINING_CERTIFICATES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of training certificates',
      },
      // Training permissions (201-management)
      {
        name: PERMISSIONS.TRAININGS.CREATE,
        resource: PERMISSION_RESOURCES.TRAININGS,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new trainings',
      },
      {
        name: PERMISSIONS.TRAININGS.READ,
        resource: PERMISSION_RESOURCES.TRAININGS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View training details',
      },
      {
        name: PERMISSIONS.TRAININGS.UPDATE,
        resource: PERMISSION_RESOURCES.TRAININGS,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update training information',
      },
      {
        name: PERMISSIONS.TRAININGS.ARCHIVE,
        resource: PERMISSION_RESOURCES.TRAININGS,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) trainings',
      },
      {
        name: PERMISSIONS.TRAININGS.RESTORE,
        resource: PERMISSION_RESOURCES.TRAININGS,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived trainings',
      },
      {
        name: PERMISSIONS.TRAININGS.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.TRAININGS,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of trainings',
      },
      // Work Experience Company permissions (201-management)
      {
        name: PERMISSIONS.WORK_EXPERIENCE_COMPANIES.CREATE,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_COMPANIES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new work experience companies',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCE_COMPANIES.READ,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_COMPANIES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View work experience company details',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCE_COMPANIES.UPDATE,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_COMPANIES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update work experience company information',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCE_COMPANIES.ARCHIVE,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_COMPANIES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) work experience companies',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCE_COMPANIES.RESTORE,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_COMPANIES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived work experience companies',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCE_COMPANIES.COMBOBOX,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_COMPANIES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get work experience companies list for dropdowns',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCE_COMPANIES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_COMPANIES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of work experience companies',
      },
      // Work Experience Job Title permissions (201-management)
      {
        name: PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.CREATE,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_JOBTITLES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new work experience job titles',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.READ,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_JOBTITLES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View work experience job title details',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.UPDATE,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_JOBTITLES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update work experience job title information',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.ARCHIVE,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_JOBTITLES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) work experience job titles',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.RESTORE,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_JOBTITLES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived work experience job titles',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.COMBOBOX,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_JOBTITLES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get work experience job titles list for dropdowns',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCE_JOBTITLES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of work experience job titles',
      },
      // Work Experience permissions (201-management)
      {
        name: PERMISSIONS.WORK_EXPERIENCES.CREATE,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new work experiences',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCES.READ,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View work experience details',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCES.UPDATE,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update work experience information',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCES.ARCHIVE,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) work experiences',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCES.RESTORE,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived work experiences',
      },
      {
        name: PERMISSIONS.WORK_EXPERIENCES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.WORK_EXPERIENCES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of work experiences',
      },
      // Education Course Level permissions (201-management)
      {
        name: PERMISSIONS.EDUCATION_COURSE_LEVELS.CREATE,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSE_LEVELS,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new education course levels',
      },
      {
        name: PERMISSIONS.EDUCATION_COURSE_LEVELS.READ,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSE_LEVELS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View education course level details',
      },
      {
        name: PERMISSIONS.EDUCATION_COURSE_LEVELS.UPDATE,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSE_LEVELS,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update education course level information',
      },
      {
        name: PERMISSIONS.EDUCATION_COURSE_LEVELS.ARCHIVE,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSE_LEVELS,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) education course levels',
      },
      {
        name: PERMISSIONS.EDUCATION_COURSE_LEVELS.RESTORE,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSE_LEVELS,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived education course levels',
      },
      {
        name: PERMISSIONS.EDUCATION_COURSE_LEVELS.COMBOBOX,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSE_LEVELS,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get education course levels list for dropdowns',
      },
      {
        name: PERMISSIONS.EDUCATION_COURSE_LEVELS.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSE_LEVELS,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of education course levels',
      },
      // Education Course permissions (201-management)
      {
        name: PERMISSIONS.EDUCATION_COURSES.CREATE,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new education courses',
      },
      {
        name: PERMISSIONS.EDUCATION_COURSES.READ,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View education course details',
      },
      {
        name: PERMISSIONS.EDUCATION_COURSES.UPDATE,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update education course information',
      },
      {
        name: PERMISSIONS.EDUCATION_COURSES.ARCHIVE,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) education courses',
      },
      {
        name: PERMISSIONS.EDUCATION_COURSES.RESTORE,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived education courses',
      },
      {
        name: PERMISSIONS.EDUCATION_COURSES.COMBOBOX,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get education courses list for dropdowns',
      },
      {
        name: PERMISSIONS.EDUCATION_COURSES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.EDUCATION_COURSES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of education courses',
      },
      // Education Level permissions (201-management)
      {
        name: PERMISSIONS.EDUCATION_LEVELS.CREATE,
        resource: PERMISSION_RESOURCES.EDUCATION_LEVELS,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new education levels',
      },
      {
        name: PERMISSIONS.EDUCATION_LEVELS.READ,
        resource: PERMISSION_RESOURCES.EDUCATION_LEVELS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View education level details',
      },
      {
        name: PERMISSIONS.EDUCATION_LEVELS.UPDATE,
        resource: PERMISSION_RESOURCES.EDUCATION_LEVELS,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update education level information',
      },
      {
        name: PERMISSIONS.EDUCATION_LEVELS.ARCHIVE,
        resource: PERMISSION_RESOURCES.EDUCATION_LEVELS,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) education levels',
      },
      {
        name: PERMISSIONS.EDUCATION_LEVELS.RESTORE,
        resource: PERMISSION_RESOURCES.EDUCATION_LEVELS,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived education levels',
      },
      {
        name: PERMISSIONS.EDUCATION_LEVELS.COMBOBOX,
        resource: PERMISSION_RESOURCES.EDUCATION_LEVELS,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get education levels list for dropdowns',
      },
      {
        name: PERMISSIONS.EDUCATION_LEVELS.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.EDUCATION_LEVELS,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of education levels',
      },
      // Education School permissions (201-management)
      {
        name: PERMISSIONS.EDUCATION_SCHOOLS.CREATE,
        resource: PERMISSION_RESOURCES.EDUCATION_SCHOOLS,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new education schools',
      },
      {
        name: PERMISSIONS.EDUCATION_SCHOOLS.READ,
        resource: PERMISSION_RESOURCES.EDUCATION_SCHOOLS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View education school details',
      },
      {
        name: PERMISSIONS.EDUCATION_SCHOOLS.UPDATE,
        resource: PERMISSION_RESOURCES.EDUCATION_SCHOOLS,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update education school information',
      },
      {
        name: PERMISSIONS.EDUCATION_SCHOOLS.ARCHIVE,
        resource: PERMISSION_RESOURCES.EDUCATION_SCHOOLS,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) education schools',
      },
      {
        name: PERMISSIONS.EDUCATION_SCHOOLS.RESTORE,
        resource: PERMISSION_RESOURCES.EDUCATION_SCHOOLS,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived education schools',
      },
      {
        name: PERMISSIONS.EDUCATION_SCHOOLS.COMBOBOX,
        resource: PERMISSION_RESOURCES.EDUCATION_SCHOOLS,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get education schools list for dropdowns',
      },
      {
        name: PERMISSIONS.EDUCATION_SCHOOLS.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.EDUCATION_SCHOOLS,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of education schools',
      },
      // Education permissions (201-management - employee education records)
      {
        name: PERMISSIONS.EDUCATIONS.CREATE,
        resource: PERMISSION_RESOURCES.EDUCATIONS,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new education records',
      },
      {
        name: PERMISSIONS.EDUCATIONS.READ,
        resource: PERMISSION_RESOURCES.EDUCATIONS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View education record details',
      },
      {
        name: PERMISSIONS.EDUCATIONS.UPDATE,
        resource: PERMISSION_RESOURCES.EDUCATIONS,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update education record information',
      },
      {
        name: PERMISSIONS.EDUCATIONS.ARCHIVE,
        resource: PERMISSION_RESOURCES.EDUCATIONS,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) education records',
      },
      {
        name: PERMISSIONS.EDUCATIONS.RESTORE,
        resource: PERMISSION_RESOURCES.EDUCATIONS,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived education records',
      },
      // Branch permissions (shared-domain)
      {
        name: PERMISSIONS.BRANCHES.CREATE,
        resource: PERMISSION_RESOURCES.BRANCHES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new branches',
      },
      {
        name: PERMISSIONS.BRANCHES.READ,
        resource: PERMISSION_RESOURCES.BRANCHES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View branch details',
      },
      {
        name: PERMISSIONS.BRANCHES.UPDATE,
        resource: PERMISSION_RESOURCES.BRANCHES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update branch information',
      },
      {
        name: PERMISSIONS.BRANCHES.ARCHIVE,
        resource: PERMISSION_RESOURCES.BRANCHES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) branches',
      },
      {
        name: PERMISSIONS.BRANCHES.RESTORE,
        resource: PERMISSION_RESOURCES.BRANCHES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived branches',
      },
      {
        name: PERMISSIONS.BRANCHES.COMBOBOX,
        resource: PERMISSION_RESOURCES.BRANCHES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get branches list for dropdowns',
      },
      {
        name: PERMISSIONS.BRANCHES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.BRANCHES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of branches',
      },
      // Department permissions (shared-domain)
      {
        name: PERMISSIONS.DEPARTMENTS.CREATE,
        resource: PERMISSION_RESOURCES.DEPARTMENTS,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new departments',
      },
      {
        name: PERMISSIONS.DEPARTMENTS.READ,
        resource: PERMISSION_RESOURCES.DEPARTMENTS,
        action: PERMISSION_ACTIONS.READ,
        description: 'View department details',
      },
      {
        name: PERMISSIONS.DEPARTMENTS.UPDATE,
        resource: PERMISSION_RESOURCES.DEPARTMENTS,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update department information',
      },
      {
        name: PERMISSIONS.DEPARTMENTS.ARCHIVE,
        resource: PERMISSION_RESOURCES.DEPARTMENTS,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) departments',
      },
      {
        name: PERMISSIONS.DEPARTMENTS.RESTORE,
        resource: PERMISSION_RESOURCES.DEPARTMENTS,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived departments',
      },
      {
        name: PERMISSIONS.DEPARTMENTS.COMBOBOX,
        resource: PERMISSION_RESOURCES.DEPARTMENTS,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get departments list for dropdowns',
      },
      {
        name: PERMISSIONS.DEPARTMENTS.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.DEPARTMENTS,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of departments',
      },
      // Jobtitle permissions (shared-domain)
      {
        name: PERMISSIONS.JOBTITLES.CREATE,
        resource: PERMISSION_RESOURCES.JOBTITLES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new job titles',
      },
      {
        name: PERMISSIONS.JOBTITLES.READ,
        resource: PERMISSION_RESOURCES.JOBTITLES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View job title details',
      },
      {
        name: PERMISSIONS.JOBTITLES.UPDATE,
        resource: PERMISSION_RESOURCES.JOBTITLES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update job title information',
      },
      {
        name: PERMISSIONS.JOBTITLES.ARCHIVE,
        resource: PERMISSION_RESOURCES.JOBTITLES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) job titles',
      },
      {
        name: PERMISSIONS.JOBTITLES.RESTORE,
        resource: PERMISSION_RESOURCES.JOBTITLES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived job titles',
      },
      {
        name: PERMISSIONS.JOBTITLES.COMBOBOX,
        resource: PERMISSION_RESOURCES.JOBTITLES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get job titles list for dropdowns',
      },
      {
        name: PERMISSIONS.JOBTITLES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.JOBTITLES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of job titles',
      },
      // Leave type permissions (shared-domain)
      {
        name: PERMISSIONS.LEAVE_TYPES.CREATE,
        resource: PERMISSION_RESOURCES.LEAVE_TYPES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new leave types',
      },
      {
        name: PERMISSIONS.LEAVE_TYPES.READ,
        resource: PERMISSION_RESOURCES.LEAVE_TYPES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View leave type details',
      },
      {
        name: PERMISSIONS.LEAVE_TYPES.UPDATE,
        resource: PERMISSION_RESOURCES.LEAVE_TYPES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update leave type information',
      },
      {
        name: PERMISSIONS.LEAVE_TYPES.ARCHIVE,
        resource: PERMISSION_RESOURCES.LEAVE_TYPES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) leave types',
      },
      {
        name: PERMISSIONS.LEAVE_TYPES.RESTORE,
        resource: PERMISSION_RESOURCES.LEAVE_TYPES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived leave types',
      },
      {
        name: PERMISSIONS.LEAVE_TYPES.COMBOBOX,
        resource: PERMISSION_RESOURCES.LEAVE_TYPES,
        action: PERMISSION_ACTIONS.COMBOBOX,
        description: 'Get leave types list for dropdowns',
      },
      {
        name: PERMISSIONS.LEAVE_TYPES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.LEAVE_TYPES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of leave types',
      },
      // Employee permissions (shared-domain)
      {
        name: PERMISSIONS.EMPLOYEES.CREATE,
        resource: PERMISSION_RESOURCES.EMPLOYEES,
        action: PERMISSION_ACTIONS.CREATE,
        description: 'Create new employees',
      },
      {
        name: PERMISSIONS.EMPLOYEES.READ,
        resource: PERMISSION_RESOURCES.EMPLOYEES,
        action: PERMISSION_ACTIONS.READ,
        description: 'View employee details',
      },
      {
        name: PERMISSIONS.EMPLOYEES.UPDATE,
        resource: PERMISSION_RESOURCES.EMPLOYEES,
        action: PERMISSION_ACTIONS.UPDATE,
        description: 'Update employee information',
      },
      {
        name: PERMISSIONS.EMPLOYEES.ARCHIVE,
        resource: PERMISSION_RESOURCES.EMPLOYEES,
        action: PERMISSION_ACTIONS.ARCHIVE,
        description: 'Archive (soft delete) employees',
      },
      {
        name: PERMISSIONS.EMPLOYEES.RESTORE,
        resource: PERMISSION_RESOURCES.EMPLOYEES,
        action: PERMISSION_ACTIONS.RESTORE,
        description: 'Restore archived employees',
      },
      {
        name: PERMISSIONS.EMPLOYEES.PAGINATED_LIST,
        resource: PERMISSION_RESOURCES.EMPLOYEES,
        action: PERMISSION_ACTIONS.PAGINATED_LIST,
        description: 'Get paginated list of employees',
      },
    ];

    /**
     * Map to store permission names to their IDs for use in role-permission seeding
     */
    const permissionMap = new Map<string, number>();

    /**
     * Process each permission:
     * - Check if permission already exists (by name field)
     * - Create new permission if it doesn't exist
     * - Log the operation result
     * - Store permission ID in map for later use
     */
    for (const permission of permissions) {
      const existing_permission = await this.entityManager.findOne(
        PermissionEntity,
        {
          where: { name: permission.name },
          withDeleted: true,
        },
      );

      if (!existing_permission) {
        const permission_entity = this.entityManager.create(PermissionEntity, {
          name: permission.name,
          resource: permission.resource,
          action: permission.action,
          description: permission.description,
          created_by: 'auto generated',
          created_at: getPHDateTime(),
        });

        const saved_permission =
          await this.entityManager.save(permission_entity);
        permissionMap.set(permission.name, saved_permission.id);
        this.logger.log(`Created permission: ${permission.name}`);
      } else {
        permissionMap.set(permission.name, existing_permission.id);
        this.logger.log(`Permission already exists: ${permission.name}`);
      }
    }

    return permissionMap;
  }
}
