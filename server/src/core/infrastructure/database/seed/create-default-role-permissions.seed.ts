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
        // Role permissions (read-only operations only)
        // Note: CREATE, UPDATE, ARCHIVE, RESTORE, ASSIGN_PERMISSIONS removed - roles are statically defined
        PERMISSIONS.ROLES.READ,
        PERMISSIONS.ROLES.COMBOBOX,
        PERMISSIONS.ROLES.PAGINATED_LIST,
        // Permission permissions (read-only operations only)
        // Note: CREATE, UPDATE, ARCHIVE, RESTORE removed - permissions are statically defined
        PERMISSIONS.PERMISSIONS.READ,
        PERMISSIONS.PERMISSIONS.COMBOBOX,
        PERMISSIONS.PERMISSIONS.PAGINATED_LIST,
        // All user permissions
        PERMISSIONS.USERS.CREATE,
        PERMISSIONS.USERS.READ,
        PERMISSIONS.USERS.UPDATE,
        PERMISSIONS.USERS.ARCHIVE,
        PERMISSIONS.USERS.RESTORE,
        PERMISSIONS.USERS.CHANGE_PASSWORD,
        PERMISSIONS.USERS.VERIFY_EMAIL,
        PERMISSIONS.USERS.COMBOBOX,
        PERMISSIONS.USERS.PAGINATED_LIST,
        // All user-role permissions
        PERMISSIONS.USER_ROLES.READ,
        PERMISSIONS.USER_ROLES.ASSIGN_ROLES,
        PERMISSIONS.USER_ROLES.REMOVE_ROLES,
        // All user-permission permissions
        PERMISSIONS.USER_PERMISSIONS.READ,
        PERMISSIONS.USER_PERMISSIONS.GRANT_PERMISSIONS,
        PERMISSIONS.USER_PERMISSIONS.DENY_PERMISSIONS,
        PERMISSIONS.USER_PERMISSIONS.REMOVE_OVERRIDES,
        // All holiday permissions
        PERMISSIONS.HOLIDAYS.CREATE,
        PERMISSIONS.HOLIDAYS.READ,
        PERMISSIONS.HOLIDAYS.UPDATE,
        PERMISSIONS.HOLIDAYS.ARCHIVE,
        PERMISSIONS.HOLIDAYS.RESTORE,
        PERMISSIONS.HOLIDAYS.COMBOBOX,
        PERMISSIONS.HOLIDAYS.PAGINATED_LIST,
        // All barangay permissions (201-management)
        PERMISSIONS.BARANGAYS.CREATE,
        PERMISSIONS.BARANGAYS.READ,
        PERMISSIONS.BARANGAYS.UPDATE,
        PERMISSIONS.BARANGAYS.ARCHIVE,
        PERMISSIONS.BARANGAYS.RESTORE,
        PERMISSIONS.BARANGAYS.COMBOBOX,
        PERMISSIONS.BARANGAYS.PAGINATED_LIST,
        // All city permissions (201-management)
        PERMISSIONS.CITIES.CREATE,
        PERMISSIONS.CITIES.READ,
        PERMISSIONS.CITIES.UPDATE,
        PERMISSIONS.CITIES.ARCHIVE,
        PERMISSIONS.CITIES.RESTORE,
        PERMISSIONS.CITIES.COMBOBOX,
        PERMISSIONS.CITIES.PAGINATED_LIST,
        // All citizenship permissions (201-management)
        PERMISSIONS.CITIZENSHIPS.CREATE,
        PERMISSIONS.CITIZENSHIPS.READ,
        PERMISSIONS.CITIZENSHIPS.UPDATE,
        PERMISSIONS.CITIZENSHIPS.ARCHIVE,
        PERMISSIONS.CITIZENSHIPS.RESTORE,
        PERMISSIONS.CITIZENSHIPS.COMBOBOX,
        PERMISSIONS.CITIZENSHIPS.PAGINATED_LIST,
        // All civil status permissions (201-management)
        PERMISSIONS.CIVIL_STATUSES.CREATE,
        PERMISSIONS.CIVIL_STATUSES.READ,
        PERMISSIONS.CIVIL_STATUSES.UPDATE,
        PERMISSIONS.CIVIL_STATUSES.ARCHIVE,
        PERMISSIONS.CIVIL_STATUSES.RESTORE,
        PERMISSIONS.CIVIL_STATUSES.COMBOBOX,
        PERMISSIONS.CIVIL_STATUSES.PAGINATED_LIST,
        // All employment type permissions (201-management)
        ...Object.values(PERMISSIONS.EMPLOYMENT_TYPES),
        // All employment status permissions (201-management)
        ...Object.values(PERMISSIONS.EMPLOYMENT_STATUSES),
        // All province permissions (201-management)
        ...Object.values(PERMISSIONS.PROVINCES),
        // All religion permissions (201-management)
        ...Object.values(PERMISSIONS.RELIGIONS),
        // All reference permissions (201-management)
        ...Object.values(PERMISSIONS.REFERENCES),
        // All training certificate permissions (201-management)
        ...Object.values(PERMISSIONS.TRAINING_CERTIFICATES),
        // All training permissions (201-management)
        ...Object.values(PERMISSIONS.TRAININGS),
        // All work experience company permissions (201-management)
        ...Object.values(PERMISSIONS.WORK_EXPERIENCE_COMPANIES),
        // All work experience job title permissions (201-management)
        ...Object.values(PERMISSIONS.WORK_EXPERIENCE_JOBTITLES),
        // All work experience permissions (201-management)
        ...Object.values(PERMISSIONS.WORK_EXPERIENCES),
        // All education course level permissions (201-management)
        ...Object.values(PERMISSIONS.EDUCATION_COURSE_LEVELS),
        // All education course permissions (201-management)
        ...Object.values(PERMISSIONS.EDUCATION_COURSES),
        // All education level permissions (201-management)
        ...Object.values(PERMISSIONS.EDUCATION_LEVELS),
        // All education school permissions (201-management)
        ...Object.values(PERMISSIONS.EDUCATION_SCHOOLS),
        // All education permissions (201-management)
        ...Object.values(PERMISSIONS.EDUCATIONS),
        // All branch permissions (shared-domain)
        ...Object.values(PERMISSIONS.BRANCHES),
        // All department permissions (shared-domain)
        ...Object.values(PERMISSIONS.DEPARTMENTS),
        // All jobtitle permissions (shared-domain)
        ...Object.values(PERMISSIONS.JOBTITLES),
        // All leave type permissions (shared-domain)
        ...Object.values(PERMISSIONS.LEAVE_TYPES),
        // All employee permissions (shared-domain)
        ...Object.values(PERMISSIONS.EMPLOYEES),
      ],
      [ROLES.EDITOR]: [
        // Role permissions (read-only operations only)
        // Note: CREATE, UPDATE removed - roles are statically defined
        PERMISSIONS.ROLES.READ,
        PERMISSIONS.ROLES.COMBOBOX,
        PERMISSIONS.ROLES.PAGINATED_LIST,
        // Permission permissions (read-only operations only)
        // Note: CREATE, UPDATE removed - permissions are statically defined
        PERMISSIONS.PERMISSIONS.READ,
        PERMISSIONS.PERMISSIONS.COMBOBOX,
        PERMISSIONS.PERMISSIONS.PAGINATED_LIST,
        // User permissions (no archive/restore)
        PERMISSIONS.USERS.CREATE,
        PERMISSIONS.USERS.READ,
        PERMISSIONS.USERS.UPDATE,
        PERMISSIONS.USERS.COMBOBOX,
        PERMISSIONS.USERS.PAGINATED_LIST,
        // User-role permissions (read only for Editor)
        PERMISSIONS.USER_ROLES.READ,
        // User-permission permissions (read only for Editor)
        PERMISSIONS.USER_PERMISSIONS.READ,
        // Holiday permissions (no archive/restore)
        PERMISSIONS.HOLIDAYS.CREATE,
        PERMISSIONS.HOLIDAYS.READ,
        PERMISSIONS.HOLIDAYS.UPDATE,
        PERMISSIONS.HOLIDAYS.COMBOBOX,
        PERMISSIONS.HOLIDAYS.PAGINATED_LIST,
        // Barangay permissions (no archive/restore)
        PERMISSIONS.BARANGAYS.CREATE,
        PERMISSIONS.BARANGAYS.READ,
        PERMISSIONS.BARANGAYS.UPDATE,
        PERMISSIONS.BARANGAYS.COMBOBOX,
        PERMISSIONS.BARANGAYS.PAGINATED_LIST,
        // City permissions (no archive/restore)
        PERMISSIONS.CITIES.CREATE,
        PERMISSIONS.CITIES.READ,
        PERMISSIONS.CITIES.UPDATE,
        PERMISSIONS.CITIES.COMBOBOX,
        PERMISSIONS.CITIES.PAGINATED_LIST,
        // Citizenship permissions (no archive/restore)
        PERMISSIONS.CITIZENSHIPS.CREATE,
        PERMISSIONS.CITIZENSHIPS.READ,
        PERMISSIONS.CITIZENSHIPS.UPDATE,
        PERMISSIONS.CITIZENSHIPS.COMBOBOX,
        PERMISSIONS.CITIZENSHIPS.PAGINATED_LIST,
        // Civil status permissions (no archive/restore)
        PERMISSIONS.CIVIL_STATUSES.CREATE,
        PERMISSIONS.CIVIL_STATUSES.READ,
        PERMISSIONS.CIVIL_STATUSES.UPDATE,
        PERMISSIONS.CIVIL_STATUSES.COMBOBOX,
        PERMISSIONS.CIVIL_STATUSES.PAGINATED_LIST,
        // Employment type, status, province, religion (no archive/restore)
        PERMISSIONS.EMPLOYMENT_TYPES.CREATE,
        PERMISSIONS.EMPLOYMENT_TYPES.READ,
        PERMISSIONS.EMPLOYMENT_TYPES.UPDATE,
        PERMISSIONS.EMPLOYMENT_TYPES.COMBOBOX,
        PERMISSIONS.EMPLOYMENT_TYPES.PAGINATED_LIST,
        PERMISSIONS.EMPLOYMENT_STATUSES.CREATE,
        PERMISSIONS.EMPLOYMENT_STATUSES.READ,
        PERMISSIONS.EMPLOYMENT_STATUSES.UPDATE,
        PERMISSIONS.EMPLOYMENT_STATUSES.COMBOBOX,
        PERMISSIONS.EMPLOYMENT_STATUSES.PAGINATED_LIST,
        PERMISSIONS.PROVINCES.CREATE,
        PERMISSIONS.PROVINCES.READ,
        PERMISSIONS.PROVINCES.UPDATE,
        PERMISSIONS.PROVINCES.COMBOBOX,
        PERMISSIONS.PROVINCES.PAGINATED_LIST,
        PERMISSIONS.RELIGIONS.CREATE,
        PERMISSIONS.RELIGIONS.READ,
        PERMISSIONS.RELIGIONS.UPDATE,
        PERMISSIONS.RELIGIONS.COMBOBOX,
        PERMISSIONS.RELIGIONS.PAGINATED_LIST,
        // Reference, training, work experience (no archive/restore)
        PERMISSIONS.REFERENCES.CREATE,
        PERMISSIONS.REFERENCES.READ,
        PERMISSIONS.REFERENCES.UPDATE,
        PERMISSIONS.REFERENCES.PAGINATED_LIST,
        ...Object.values(PERMISSIONS.TRAINING_CERTIFICATES).filter(
          (p) => !['archive', 'restore'].some((a) => p.includes(a)),
        ),
        PERMISSIONS.TRAININGS.CREATE,
        PERMISSIONS.TRAININGS.READ,
        PERMISSIONS.TRAININGS.UPDATE,
        PERMISSIONS.TRAININGS.PAGINATED_LIST,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.CREATE,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.READ,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.UPDATE,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.COMBOBOX,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.PAGINATED_LIST,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.CREATE,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.READ,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.UPDATE,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.COMBOBOX,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.PAGINATED_LIST,
        PERMISSIONS.WORK_EXPERIENCES.CREATE,
        PERMISSIONS.WORK_EXPERIENCES.READ,
        PERMISSIONS.WORK_EXPERIENCES.UPDATE,
        PERMISSIONS.WORK_EXPERIENCES.PAGINATED_LIST,
        // Education (no archive/restore)
        ...Object.values(PERMISSIONS.EDUCATION_COURSE_LEVELS).filter(
          (p) => !['archive', 'restore'].some((a) => p.includes(a)),
        ),
        ...Object.values(PERMISSIONS.EDUCATION_COURSES).filter(
          (p) => !['archive', 'restore'].some((a) => p.includes(a)),
        ),
        ...Object.values(PERMISSIONS.EDUCATION_LEVELS).filter(
          (p) => !['archive', 'restore'].some((a) => p.includes(a)),
        ),
        ...Object.values(PERMISSIONS.EDUCATION_SCHOOLS).filter(
          (p) => !['archive', 'restore'].some((a) => p.includes(a)),
        ),
        ...Object.values(PERMISSIONS.EDUCATIONS).filter(
          (p) => !['archive', 'restore'].some((a) => p.includes(a)),
        ),
        // Branch, department, jobtitle (no archive/restore)
        PERMISSIONS.BRANCHES.CREATE,
        PERMISSIONS.BRANCHES.READ,
        PERMISSIONS.BRANCHES.UPDATE,
        PERMISSIONS.BRANCHES.COMBOBOX,
        PERMISSIONS.BRANCHES.PAGINATED_LIST,
        PERMISSIONS.DEPARTMENTS.CREATE,
        PERMISSIONS.DEPARTMENTS.READ,
        PERMISSIONS.DEPARTMENTS.UPDATE,
        PERMISSIONS.DEPARTMENTS.COMBOBOX,
        PERMISSIONS.DEPARTMENTS.PAGINATED_LIST,
        PERMISSIONS.JOBTITLES.CREATE,
        PERMISSIONS.JOBTITLES.READ,
        PERMISSIONS.JOBTITLES.UPDATE,
        PERMISSIONS.JOBTITLES.COMBOBOX,
        PERMISSIONS.JOBTITLES.PAGINATED_LIST,
        // Leave type (no archive/restore)
        PERMISSIONS.LEAVE_TYPES.CREATE,
        PERMISSIONS.LEAVE_TYPES.READ,
        PERMISSIONS.LEAVE_TYPES.UPDATE,
        PERMISSIONS.LEAVE_TYPES.COMBOBOX,
        PERMISSIONS.LEAVE_TYPES.PAGINATED_LIST,
        // Employee (no archive/restore)
        PERMISSIONS.EMPLOYEES.CREATE,
        PERMISSIONS.EMPLOYEES.READ,
        PERMISSIONS.EMPLOYEES.UPDATE,
        PERMISSIONS.EMPLOYEES.PAGINATED_LIST,
      ],
      [ROLES.VIEWER]: [
        // Read-only role permissions
        PERMISSIONS.ROLES.READ,
        PERMISSIONS.ROLES.COMBOBOX,
        PERMISSIONS.ROLES.PAGINATED_LIST,
        // Read-only permission permissions
        PERMISSIONS.PERMISSIONS.READ,
        PERMISSIONS.PERMISSIONS.COMBOBOX,
        PERMISSIONS.PERMISSIONS.PAGINATED_LIST,
        // Read-only user permissions
        PERMISSIONS.USERS.READ,
        PERMISSIONS.USERS.COMBOBOX,
        PERMISSIONS.USERS.PAGINATED_LIST,
        // Read-only user-role permissions
        PERMISSIONS.USER_ROLES.READ,
        // Read-only user-permission permissions
        PERMISSIONS.USER_PERMISSIONS.READ,
        // Read-only holiday permissions
        PERMISSIONS.HOLIDAYS.READ,
        PERMISSIONS.HOLIDAYS.COMBOBOX,
        PERMISSIONS.HOLIDAYS.PAGINATED_LIST,
        // Read-only barangay permissions
        PERMISSIONS.BARANGAYS.READ,
        PERMISSIONS.BARANGAYS.COMBOBOX,
        PERMISSIONS.BARANGAYS.PAGINATED_LIST,
        // Read-only city permissions
        PERMISSIONS.CITIES.READ,
        PERMISSIONS.CITIES.COMBOBOX,
        PERMISSIONS.CITIES.PAGINATED_LIST,
        // Read-only citizenship permissions
        PERMISSIONS.CITIZENSHIPS.READ,
        PERMISSIONS.CITIZENSHIPS.COMBOBOX,
        PERMISSIONS.CITIZENSHIPS.PAGINATED_LIST,
        // Read-only civil status permissions
        PERMISSIONS.CIVIL_STATUSES.READ,
        PERMISSIONS.CIVIL_STATUSES.COMBOBOX,
        PERMISSIONS.CIVIL_STATUSES.PAGINATED_LIST,
        // Read-only permissions for all other resources
        PERMISSIONS.EMPLOYMENT_TYPES.READ,
        PERMISSIONS.EMPLOYMENT_TYPES.COMBOBOX,
        PERMISSIONS.EMPLOYMENT_TYPES.PAGINATED_LIST,
        PERMISSIONS.EMPLOYMENT_STATUSES.READ,
        PERMISSIONS.EMPLOYMENT_STATUSES.COMBOBOX,
        PERMISSIONS.EMPLOYMENT_STATUSES.PAGINATED_LIST,
        PERMISSIONS.PROVINCES.READ,
        PERMISSIONS.PROVINCES.COMBOBOX,
        PERMISSIONS.PROVINCES.PAGINATED_LIST,
        PERMISSIONS.RELIGIONS.READ,
        PERMISSIONS.RELIGIONS.COMBOBOX,
        PERMISSIONS.RELIGIONS.PAGINATED_LIST,
        PERMISSIONS.REFERENCES.READ,
        PERMISSIONS.REFERENCES.PAGINATED_LIST,
        PERMISSIONS.TRAINING_CERTIFICATES.READ,
        PERMISSIONS.TRAINING_CERTIFICATES.COMBOBOX,
        PERMISSIONS.TRAINING_CERTIFICATES.PAGINATED_LIST,
        PERMISSIONS.TRAININGS.READ,
        PERMISSIONS.TRAININGS.PAGINATED_LIST,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.READ,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.COMBOBOX,
        PERMISSIONS.WORK_EXPERIENCE_COMPANIES.PAGINATED_LIST,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.READ,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.COMBOBOX,
        PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.PAGINATED_LIST,
        PERMISSIONS.WORK_EXPERIENCES.READ,
        PERMISSIONS.WORK_EXPERIENCES.PAGINATED_LIST,
        PERMISSIONS.EDUCATION_COURSE_LEVELS.READ,
        PERMISSIONS.EDUCATION_COURSE_LEVELS.COMBOBOX,
        PERMISSIONS.EDUCATION_COURSE_LEVELS.PAGINATED_LIST,
        PERMISSIONS.EDUCATION_COURSES.READ,
        PERMISSIONS.EDUCATION_COURSES.COMBOBOX,
        PERMISSIONS.EDUCATION_COURSES.PAGINATED_LIST,
        PERMISSIONS.EDUCATION_LEVELS.READ,
        PERMISSIONS.EDUCATION_LEVELS.COMBOBOX,
        PERMISSIONS.EDUCATION_LEVELS.PAGINATED_LIST,
        PERMISSIONS.EDUCATION_SCHOOLS.READ,
        PERMISSIONS.EDUCATION_SCHOOLS.COMBOBOX,
        PERMISSIONS.EDUCATION_SCHOOLS.PAGINATED_LIST,
        PERMISSIONS.EDUCATIONS.READ,
        PERMISSIONS.BRANCHES.READ,
        PERMISSIONS.BRANCHES.COMBOBOX,
        PERMISSIONS.BRANCHES.PAGINATED_LIST,
        PERMISSIONS.DEPARTMENTS.READ,
        PERMISSIONS.DEPARTMENTS.COMBOBOX,
        PERMISSIONS.DEPARTMENTS.PAGINATED_LIST,
        PERMISSIONS.JOBTITLES.READ,
        PERMISSIONS.JOBTITLES.COMBOBOX,
        PERMISSIONS.JOBTITLES.PAGINATED_LIST,
        PERMISSIONS.LEAVE_TYPES.READ,
        PERMISSIONS.LEAVE_TYPES.COMBOBOX,
        PERMISSIONS.LEAVE_TYPES.PAGINATED_LIST,
        PERMISSIONS.EMPLOYEES.READ,
        PERMISSIONS.EMPLOYEES.PAGINATED_LIST,
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
