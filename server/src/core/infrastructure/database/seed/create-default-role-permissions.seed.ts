import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { RolePermissionEntity } from '@/features/rbac/infrastructure/database/entities/role-permission.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { ROLES, PERMISSIONS } from '@/core/domain/constants';

/**
 * SeedRolePermissions
 *
 * This seed class links default roles to their permissions.
 *
 * PURPOSE:
 * Role-permission links define which permissions each role has access to.
 * This establishes the authorization structure of the RBAC system.
 *
 * USAGE:
 * This seed creates role-permission links:
 * - Admin: All permissions (roles, permissions, users, user_roles, user_permissions, holidays)
 * - Editor: Create, read, update permissions (no archive/restore) for roles, permissions, users, holidays
 * - Viewer: Read-only permissions (read, combobox, paginated_list) for roles, permissions, users, holidays
 *
 * NOTE:
 * The seed is idempotent - running it multiple times will not create duplicates.
 * Role-permission links are checked by the unique combination of role_id and permission_id.
 */
export class SeedRolePermissions {
  private readonly logger = new Logger(SeedRolePermissions.name);

  constructor(private readonly entityManager: EntityManager) { }

  /**
   * Executes the seed operation to create default role-permission links.
   *
   * This method:
   * 1. Defines which permissions each role should have
   * 2. Checks if each role-permission link already exists
   * 3. Creates new links only if they don't exist (idempotent operation)
   * 4. Logs the creation or existence of each link
   *
   * @param roleMap Map of role names to role IDs (from SeedRoles)
   * @param permissionMap Map of permission names to permission IDs (from SeedPermissions)
   *
   * The seed is idempotent - running it multiple times will not create duplicates.
   */
  async run(
    roleMap: Map<string, number>,
    permissionMap: Map<string, number>,
  ): Promise<void> {
    /**
     * Define role-permission mappings.
     * Format: { roleName: [permissionName1, permissionName2, ...] }
     */
    const rolePermissionMappings: Record<string, string[]> = {
      [ROLES.ADMIN]: [
        /**
         * RBAC permissions
         */
        // Role permissions (read-only operations only) (rbac)
        // Note: CREATE, UPDATE, ARCHIVE, RESTORE, ASSIGN_PERMISSIONS removed - roles are statically defined
        PERMISSIONS.ROLES.READ,
        // Permission permissions (read-only operations only) (rbac)
        // Note: CREATE, UPDATE, ARCHIVE, RESTORE removed - permissions are statically defined
        PERMISSIONS.PERMISSIONS.READ,
        // All user-role permissions (rbac)
        PERMISSIONS.USER_ROLES.READ,
        PERMISSIONS.USER_ROLES.ASSIGN_ROLES,
        // All user-permission permissions (rbac)
        PERMISSIONS.USER_PERMISSIONS.READ,
        PERMISSIONS.USER_PERMISSIONS.GRANT_PERMISSIONS,
        PERMISSIONS.USER_PERMISSIONS.DENY_PERMISSIONS,
        PERMISSIONS.USER_PERMISSIONS.REMOVE_OVERRIDES,
        // All user permissions (user-management)
        PERMISSIONS.USERS.CREATE,
        PERMISSIONS.USERS.READ,
        PERMISSIONS.USERS.UPDATE,
        PERMISSIONS.USERS.ARCHIVE,
        PERMISSIONS.USERS.RESTORE,
        PERMISSIONS.USERS.CHANGE_PASSWORD,
        PERMISSIONS.USERS.VERIFY_EMAIL,
        /**
         * Shared-domain permissions
         */
        // All holiday permissions (shared-domain)
        PERMISSIONS.HOLIDAYS.CREATE,
        PERMISSIONS.HOLIDAYS.READ,
        PERMISSIONS.HOLIDAYS.UPDATE,
        PERMISSIONS.HOLIDAYS.ARCHIVE,
        PERMISSIONS.HOLIDAYS.RESTORE,
        // All branch permissions (shared-domain)
        PERMISSIONS.BRANCHES.CREATE,
        PERMISSIONS.BRANCHES.READ,
        PERMISSIONS.BRANCHES.UPDATE,
        PERMISSIONS.BRANCHES.ARCHIVE,
        PERMISSIONS.BRANCHES.RESTORE,
        // All department permissions (shared-domain)
        PERMISSIONS.DEPARTMENTS.CREATE,
        PERMISSIONS.DEPARTMENTS.READ,
        PERMISSIONS.DEPARTMENTS.UPDATE,
        PERMISSIONS.DEPARTMENTS.ARCHIVE,
        PERMISSIONS.DEPARTMENTS.RESTORE,
        // All jobtitle permissions (shared-domain)
        PERMISSIONS.JOBTITLES.CREATE,
        PERMISSIONS.JOBTITLES.READ,
        PERMISSIONS.JOBTITLES.UPDATE,
        PERMISSIONS.JOBTITLES.ARCHIVE,
        PERMISSIONS.JOBTITLES.RESTORE,
        // All leave type permissions (shared-domain)
        PERMISSIONS.LEAVE_TYPES.CREATE,
        PERMISSIONS.LEAVE_TYPES.READ,
        PERMISSIONS.LEAVE_TYPES.UPDATE,
        PERMISSIONS.LEAVE_TYPES.ARCHIVE,
        PERMISSIONS.LEAVE_TYPES.RESTORE,
        // All employee permissions (shared-domain)
        PERMISSIONS.EMPLOYEES.CREATE,
        PERMISSIONS.EMPLOYEES.READ,
        PERMISSIONS.EMPLOYEES.UPDATE,
        PERMISSIONS.EMPLOYEES.UPDATE_IMAGE_PATH,
        PERMISSIONS.EMPLOYEES.UPDATE_GOVERNMENT_DETAILS,
        PERMISSIONS.EMPLOYEES.UPDATE_SALARY_DETAILS,
        PERMISSIONS.EMPLOYEES.UPDATE_BANK_DETAILS,
        PERMISSIONS.EMPLOYEES.ARCHIVE,
        PERMISSIONS.EMPLOYEES.RESTORE,
        /**
         * 201-management permissions
         */
        // All barangay permissions (201-management)
        PERMISSIONS.BARANGAYS.CREATE,
        PERMISSIONS.BARANGAYS.READ,
        PERMISSIONS.BARANGAYS.UPDATE,
        PERMISSIONS.BARANGAYS.ARCHIVE,
        PERMISSIONS.BARANGAYS.RESTORE,
        // All citizenship permissions (201-management)
        PERMISSIONS.CITIZENSHIPS.CREATE,
        PERMISSIONS.CITIZENSHIPS.READ,
        PERMISSIONS.CITIZENSHIPS.UPDATE,
        PERMISSIONS.CITIZENSHIPS.ARCHIVE,
        PERMISSIONS.CITIZENSHIPS.RESTORE,
        // All city permissions (201-management)
        PERMISSIONS.CITIES.CREATE,
        PERMISSIONS.CITIES.READ,
        PERMISSIONS.CITIES.UPDATE,
        PERMISSIONS.CITIES.ARCHIVE,
        PERMISSIONS.CITIES.RESTORE,
        // All civil status permissions (201-management)
        PERMISSIONS.CIVIL_STATUSES.CREATE,
        PERMISSIONS.CIVIL_STATUSES.READ,
        PERMISSIONS.CIVIL_STATUSES.UPDATE,
        PERMISSIONS.CIVIL_STATUSES.ARCHIVE,
        PERMISSIONS.CIVIL_STATUSES.RESTORE,
        // All education course level permissions (201-management)
        PERMISSIONS.EDUCATION_COURSE_LEVELS.CREATE,
        PERMISSIONS.EDUCATION_COURSE_LEVELS.READ,
        PERMISSIONS.EDUCATION_COURSE_LEVELS.UPDATE,
        PERMISSIONS.EDUCATION_COURSE_LEVELS.ARCHIVE,
        PERMISSIONS.EDUCATION_COURSE_LEVELS.RESTORE,
        // All education course permissions (201-management)
        PERMISSIONS.EDUCATION_COURSES.CREATE,
        PERMISSIONS.EDUCATION_COURSES.READ,
        PERMISSIONS.EDUCATION_COURSES.UPDATE,
        PERMISSIONS.EDUCATION_COURSES.ARCHIVE,
        PERMISSIONS.EDUCATION_COURSES.RESTORE,
        // All education level permissions (201-management)
        PERMISSIONS.EDUCATION_LEVELS.CREATE,
        PERMISSIONS.EDUCATION_LEVELS.READ,
        PERMISSIONS.EDUCATION_LEVELS.UPDATE,
        PERMISSIONS.EDUCATION_LEVELS.ARCHIVE,
        PERMISSIONS.EDUCATION_LEVELS.RESTORE,
        // All education school permissions (201-management)
        PERMISSIONS.EDUCATION_SCHOOLS.CREATE,
        PERMISSIONS.EDUCATION_SCHOOLS.READ,
        PERMISSIONS.EDUCATION_SCHOOLS.UPDATE,
        PERMISSIONS.EDUCATION_SCHOOLS.ARCHIVE,
        PERMISSIONS.EDUCATION_SCHOOLS.RESTORE,
        // All education permissions (201-management)
        PERMISSIONS.EDUCATIONS.CREATE,
        PERMISSIONS.EDUCATIONS.READ,
        PERMISSIONS.EDUCATIONS.UPDATE,
        PERMISSIONS.EDUCATIONS.ARCHIVE,
        PERMISSIONS.EDUCATIONS.RESTORE,
        // All employment status permissions (201-management)
        PERMISSIONS.EMPLOYMENT_STATUSES.CREATE,
        PERMISSIONS.EMPLOYMENT_STATUSES.READ,
        PERMISSIONS.EMPLOYMENT_STATUSES.UPDATE,
        PERMISSIONS.EMPLOYMENT_STATUSES.ARCHIVE,
        PERMISSIONS.EMPLOYMENT_STATUSES.RESTORE,
        // All employment type permissions (201-management)
        PERMISSIONS.EMPLOYMENT_TYPES.CREATE,
        PERMISSIONS.EMPLOYMENT_TYPES.READ,
        PERMISSIONS.EMPLOYMENT_TYPES.UPDATE,
        PERMISSIONS.EMPLOYMENT_TYPES.ARCHIVE,
        PERMISSIONS.EMPLOYMENT_TYPES.RESTORE,
        // All province permissions (201-management)
        PERMISSIONS.PROVINCES.CREATE,
        PERMISSIONS.PROVINCES.READ,
        PERMISSIONS.PROVINCES.UPDATE,
        PERMISSIONS.PROVINCES.ARCHIVE,
        PERMISSIONS.PROVINCES.RESTORE,
        // All reference permissions (201-management)
        PERMISSIONS.RELIGIONS.CREATE,
        PERMISSIONS.RELIGIONS.READ,
        PERMISSIONS.RELIGIONS.UPDATE,
        PERMISSIONS.RELIGIONS.ARCHIVE,
        PERMISSIONS.RELIGIONS.RESTORE,
        // religion permissions (201-management)
        PERMISSIONS.RELIGIONS.CREATE,
        PERMISSIONS.RELIGIONS.READ,
        PERMISSIONS.RELIGIONS.UPDATE,
        PERMISSIONS.RELIGIONS.ARCHIVE,
        PERMISSIONS.RELIGIONS.RESTORE,
        // All training certificate permissions (201-management)
        PERMISSIONS.TRAINING_CERTIFICATES.CREATE,
        PERMISSIONS.TRAINING_CERTIFICATES.READ,
        PERMISSIONS.TRAINING_CERTIFICATES.UPDATE,
        PERMISSIONS.TRAINING_CERTIFICATES.ARCHIVE,
        PERMISSIONS.TRAINING_CERTIFICATES.RESTORE,
        // all training permissions (201-management)
        PERMISSIONS.TRAININGS.CREATE,
        PERMISSIONS.TRAININGS.READ,
        PERMISSIONS.TRAININGS.UPDATE,
        PERMISSIONS.TRAININGS.ARCHIVE,
        PERMISSIONS.TRAININGS.RESTORE,
        // All work experience company permissions (201-management)
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.CREATE,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.READ,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.UPDATE,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.ARCHIVE,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.RESTORE,
        // All work experience job title permissions (201-management)
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.CREATE,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.READ,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.UPDATE,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.ARCHIVE,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.RESTORE,
        // All work experience permissions (201-management)
        PERMISSIONS.WORK_EXPERIENCES.CREATE,
        PERMISSIONS.WORK_EXPERIENCES.READ,
        PERMISSIONS.WORK_EXPERIENCES.UPDATE,
        PERMISSIONS.WORK_EXPERIENCES.ARCHIVE,
        PERMISSIONS.WORK_EXPERIENCES.RESTORE,
        /**
         * Leave management permissions
         */
        // All leave year configuration permissions (leave-management)
        PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.CREATE,
        PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.READ,
        PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.UPDATE,
        PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.ARCHIVE,
        PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.RESTORE,
        // All leave policy permissions (leave-management)
        PERMISSIONS.LEAVE_POLICIES.CREATE,
        PERMISSIONS.LEAVE_POLICIES.READ,
        PERMISSIONS.LEAVE_POLICIES.UPDATE,
        PERMISSIONS.LEAVE_POLICIES.ARCHIVE,
        PERMISSIONS.LEAVE_POLICIES.RESTORE,
        PERMISSIONS.LEAVE_POLICIES.ACTIVATE,
        PERMISSIONS.LEAVE_POLICIES.RETIRE,
      ],
      [ROLES.EDITOR]: [
        /**
        * NO DELETE OR ARCHIVE OR RESTORE FOR RBAC PERMISSIONS
       * RBAC permissions read, read, assign roles, grant permissions, deny permissions, remove overrides
       */
        PERMISSIONS.ROLES.READ,
        PERMISSIONS.PERMISSIONS.READ,
        PERMISSIONS.USER_ROLES.READ,
        PERMISSIONS.USER_ROLES.ASSIGN_ROLES,
        PERMISSIONS.USER_PERMISSIONS.READ,
        PERMISSIONS.USER_PERMISSIONS.GRANT_PERMISSIONS,
        PERMISSIONS.USER_PERMISSIONS.DENY_PERMISSIONS,
        PERMISSIONS.USER_PERMISSIONS.REMOVE_OVERRIDES,
        /**
         * NO DELETE OR ARCHIVE OR RESTORE FOR USER MANAGEMENT PERMISSIONS
         * User management permissions create, read, update, change password, verify email
         */
        PERMISSIONS.USERS.CREATE,
        PERMISSIONS.USERS.READ,
        PERMISSIONS.USERS.UPDATE,
        PERMISSIONS.USERS.CHANGE_PASSWORD,
        PERMISSIONS.USERS.VERIFY_EMAIL,
        /**
         * NO DELETE OR ARCHIVE OR RESTORE FOR SHARED-DOMAIN PERMISSIONS
         * Shared-domain permissions update, read, create 
         */
        PERMISSIONS.HOLIDAYS.CREATE,
        PERMISSIONS.HOLIDAYS.READ,
        PERMISSIONS.HOLIDAYS.UPDATE,
        PERMISSIONS.BRANCHES.CREATE,
        PERMISSIONS.BRANCHES.READ,
        PERMISSIONS.BRANCHES.UPDATE,
        PERMISSIONS.DEPARTMENTS.CREATE,
        PERMISSIONS.DEPARTMENTS.READ,
        PERMISSIONS.DEPARTMENTS.UPDATE,
        PERMISSIONS.JOBTITLES.CREATE,
        PERMISSIONS.JOBTITLES.READ,
        PERMISSIONS.JOBTITLES.UPDATE,
        PERMISSIONS.LEAVE_TYPES.CREATE,
        PERMISSIONS.LEAVE_TYPES.READ,
        PERMISSIONS.LEAVE_TYPES.UPDATE,
        PERMISSIONS.EMPLOYEES.CREATE,
        PERMISSIONS.EMPLOYEES.READ,
        PERMISSIONS.EMPLOYEES.UPDATE,
        PERMISSIONS.EMPLOYEES.UPDATE_IMAGE_PATH,
        PERMISSIONS.EMPLOYEES.UPDATE_GOVERNMENT_DETAILS,
        PERMISSIONS.EMPLOYEES.UPDATE_SALARY_DETAILS,
        PERMISSIONS.EMPLOYEES.UPDATE_BANK_DETAILS,
        /**
         * NO DELETE OR ARCHIVE OR RESTORE FOR 201-MANAGEMENT PERMISSIONS
         * 201-management permissions create, read, update
         */
        PERMISSIONS.BARANGAYS.CREATE,
        PERMISSIONS.BARANGAYS.READ,
        PERMISSIONS.BARANGAYS.UPDATE,
        PERMISSIONS.CITIZENSHIPS.CREATE,
        PERMISSIONS.CITIZENSHIPS.READ,
        PERMISSIONS.CITIZENSHIPS.UPDATE,
        PERMISSIONS.CITIES.CREATE,
        PERMISSIONS.CITIES.READ,
        PERMISSIONS.CITIES.UPDATE,
        PERMISSIONS.CIVIL_STATUSES.CREATE,
        PERMISSIONS.CIVIL_STATUSES.READ,
        PERMISSIONS.CIVIL_STATUSES.UPDATE,
        PERMISSIONS.EDUCATION_COURSE_LEVELS.CREATE,
        PERMISSIONS.EDUCATION_COURSE_LEVELS.READ,
        PERMISSIONS.EDUCATION_COURSE_LEVELS.UPDATE,
        PERMISSIONS.EDUCATION_COURSES.CREATE,
        PERMISSIONS.EDUCATION_COURSES.READ,
        PERMISSIONS.EDUCATION_COURSES.UPDATE,
        PERMISSIONS.EDUCATION_LEVELS.CREATE,
        PERMISSIONS.EDUCATION_LEVELS.READ,
        PERMISSIONS.EDUCATION_LEVELS.UPDATE,
        PERMISSIONS.EDUCATION_SCHOOLS.CREATE,
        PERMISSIONS.EDUCATION_SCHOOLS.READ,
        PERMISSIONS.EDUCATION_SCHOOLS.UPDATE,
        PERMISSIONS.EDUCATIONS.CREATE,
        PERMISSIONS.EDUCATIONS.READ,
        PERMISSIONS.EDUCATIONS.UPDATE,
        PERMISSIONS.EMPLOYMENT_STATUSES.CREATE,
        PERMISSIONS.EMPLOYMENT_STATUSES.READ,
        PERMISSIONS.EMPLOYMENT_STATUSES.UPDATE,
        PERMISSIONS.EMPLOYMENT_TYPES.CREATE,
        PERMISSIONS.EMPLOYMENT_TYPES.READ,
        PERMISSIONS.EMPLOYMENT_TYPES.UPDATE,
        PERMISSIONS.PROVINCES.CREATE,
        PERMISSIONS.PROVINCES.READ,
        PERMISSIONS.PROVINCES.UPDATE,
        PERMISSIONS.RELIGIONS.CREATE,
        PERMISSIONS.RELIGIONS.READ,
        PERMISSIONS.RELIGIONS.UPDATE,
        PERMISSIONS.RELIGIONS.CREATE,
        PERMISSIONS.RELIGIONS.READ,
        PERMISSIONS.RELIGIONS.UPDATE,
        PERMISSIONS.TRAINING_CERTIFICATES.CREATE,
        PERMISSIONS.TRAINING_CERTIFICATES.READ,
        PERMISSIONS.TRAINING_CERTIFICATES.UPDATE,
        PERMISSIONS.TRAININGS.CREATE,
        PERMISSIONS.TRAININGS.READ,
        PERMISSIONS.TRAININGS.UPDATE,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.CREATE,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.READ,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.CREATE,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.READ,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.UPDATE,
        PERMISSIONS.WORK_EXPERIENCES.CREATE,
        PERMISSIONS.WORK_EXPERIENCES.READ,
        PERMISSIONS.WORK_EXPERIENCES.UPDATE,
        /**
         * Leave management permissions
         */
        // All leave year configuration permissions (leave-management)
        PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.CREATE,
        PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.READ,
        PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.UPDATE,
        PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.ARCHIVE,
        PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.RESTORE,
        // All leave policy permissions (leave-management)
        PERMISSIONS.LEAVE_POLICIES.CREATE,
        PERMISSIONS.LEAVE_POLICIES.READ,
        PERMISSIONS.LEAVE_POLICIES.UPDATE,
        PERMISSIONS.LEAVE_POLICIES.ARCHIVE,
        PERMISSIONS.LEAVE_POLICIES.RESTORE,
        PERMISSIONS.LEAVE_POLICIES.ACTIVATE,
        PERMISSIONS.LEAVE_POLICIES.RETIRE,
      ],
      [ROLES.VIEWER]: [
        /**
         * RBAC permissions read-only
         */
        PERMISSIONS.ROLES.READ,
        PERMISSIONS.PERMISSIONS.READ,
        PERMISSIONS.USER_ROLES.READ,
        PERMISSIONS.USER_PERMISSIONS.READ,
        /**
         * User management permissions read-only
         */
        PERMISSIONS.USERS.READ,
        /**
         * Shared-domain permissions read-only
         */
        PERMISSIONS.HOLIDAYS.READ,
        PERMISSIONS.BRANCHES.READ,
        PERMISSIONS.DEPARTMENTS.READ,
        PERMISSIONS.JOBTITLES.READ,
        PERMISSIONS.LEAVE_TYPES.READ,
        PERMISSIONS.EMPLOYEES.READ,
        /**
         * 201-management permissions read-only
         */
        PERMISSIONS.BARANGAYS.READ,
        PERMISSIONS.CITIZENSHIPS.READ,
        PERMISSIONS.CITIES.READ,
        PERMISSIONS.CIVIL_STATUSES.READ,
        PERMISSIONS.EDUCATION_COURSE_LEVELS.READ,
        PERMISSIONS.EDUCATION_COURSES.READ,
        PERMISSIONS.EDUCATION_LEVELS.READ,
        PERMISSIONS.EDUCATION_SCHOOLS.READ,
        PERMISSIONS.EDUCATIONS.READ,
        PERMISSIONS.EMPLOYMENT_STATUSES.READ,
        PERMISSIONS.EMPLOYMENT_TYPES.READ,
        PERMISSIONS.PROVINCES.READ,
        PERMISSIONS.RELIGIONS.READ,
        PERMISSIONS.RELIGIONS.READ,
        PERMISSIONS.TRAINING_CERTIFICATES.READ,
        PERMISSIONS.TRAININGS.READ,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.READ,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.READ,
        PERMISSIONS.WORK_EXPERIENCES.READ,
        /**
         * Leave management permissions read-only
         */
        PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.READ,
        // All leave policy permissions (leave-management)
        PERMISSIONS.LEAVE_POLICIES.READ,
      ],
    };

    /**
     * Process each role and its assigned permissions:
     * - Get role ID from roleMap
     * - For each permission name, get permission ID from permissionMap
     * - Check if role-permission link already exists
     * - Create new link if it doesn't exist
     * - Log the operation result
     */
    for (const [roleName, permissionNames] of Object.entries(
      rolePermissionMappings,
    )) {
      const roleId = roleMap.get(roleName);

      if (!roleId) {
        this.logger.warn(
          `Role "${roleName}" not found in roleMap. Skipping permissions assignment.`,
        );
        continue;
      }

      for (const permissionName of permissionNames) {
        const permissionId = permissionMap.get(permissionName);

        if (!permissionId) {
          this.logger.warn(
            `Permission "${permissionName}" not found in permissionMap. Skipping.`,
          );
          continue;
        }

        // Check if role-permission link already exists
        const existing_link = await this.entityManager.findOne(
          RolePermissionEntity,
          {
            where: {
              role_id: roleId,
              permission_id: permissionId,
            },
          },
        );

        if (!existing_link) {
          const role_permission_entity = this.entityManager.create(
            RolePermissionEntity,
            {
              role_id: roleId,
              permission_id: permissionId,
              created_by: 'auto generated',
              created_at: getPHDateTime(),
            },
          );

          await this.entityManager.save(role_permission_entity);
          this.logger.log(
            `Created role-permission link: ${roleName} -> ${permissionName}`,
          );
        } else {
          this.logger.log(
            `Role-permission link already exists: ${roleName} -> ${permissionName}`,
          );
        }
      }
    }
  }
}
