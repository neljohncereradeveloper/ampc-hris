import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { Logger } from '@nestjs/common';
import { allEntities } from '../entities';
import { SeedPermissions } from './create-default-permissions.seed';
import { SeedRoles } from './create-default-roles.seed';
import { SeedRolePermissions } from './create-default-role-permissions.seed';
import { SeedAdminAccount } from './create-default-admin.seed';
import { SeedEmploymentTypes } from './seed-employment-types.seed';
import { SeedEmploymentStatuses } from './seed-employment-statuses.seed';
import { SeedCivilStatuses } from './seed-civil-statuses.seed';
import { SeedReligions } from './seed-religions.seed';
import { SeedCitizenships } from './seed-citizenships.seed';
import { SeedLeaveTypes } from './seed-leave-types.seed';
import { SeedBranches } from './seed-branches.seed';
import { SeedDepartments } from './seed-departments.seed';
import { SeedJobTitles } from './seed-job-titles.seed';
import { SeedProvinces } from './seed-provinces.seed';
import { SeedCities } from './seed-cities.seed';
import { SeedBarangays } from './seed-barangays.seed';
import { SeedEducationLevels } from './seed-education-levels.seed';
import { SeedEducationSchools } from './seed-education-schools.seed';
import { SeedEducationCourses } from './seed-education-courses.seed';
import { SeedEducationCourseLevels } from './seed-education-course-levels.seed';
import { SeedWorkExperienceCompanies } from './seed-work-experience-companies.seed';
import { SeedWorkExperienceJobTitles } from './seed-work-experience-job-titles.seed';
import { SeedTrainingCertificates } from './seed-training-certificates.seed';
import { SeedHolidays } from './seed-holidays.seed';

// Load environment variables from .env
dotenvConfig();

// Define the standalone DataSource configuration
const data_source = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  // host: process.env.DB_HOST || 'localhost',
  // port: Number(process.env.DB_PORT) || 5432,
  // username: process.env.DB_USERNAME || 'postgres',
  // password: process.env.DB_PASSWORD || 'postgres',
  // database: process.env.DB_DATABASE || 'hris',
  entities: allEntities,
  synchronize: false, // Avoid sync in production
  logging: process.env.DB_LOGGING === 'true',
});

class SeedRunner {
  private readonly logger = new Logger('SeedRunner');

  constructor(private readonly data_source: DataSource) {}

  async run() {
    // Initialize database connection
    await this.data_source.initialize();
    this.logger.debug('Seeder Database connected successfully.');

    // Start a query runner for manual transaction control
    const query_runner = this.data_source.createQueryRunner();
    await query_runner.connect();
    await query_runner.startTransaction();

    try {
      // Execute all seeds within the transaction
      // Order matters: permissions first, then roles, then role-permissions

      // 1. Seed permissions
      const permissions_seeder = new SeedPermissions(query_runner.manager);
      const permissionMap = await permissions_seeder.run();
      this.logger.log('Permissions seeded');

      // 2. Seed roles
      const roles_seeder = new SeedRoles(query_runner.manager);
      const roleMap = await roles_seeder.run();
      this.logger.log('Roles seeded');

      // 3. Seed role-permissions (links roles to permissions)
      const role_permissions_seeder = new SeedRolePermissions(
        query_runner.manager,
      );
      await role_permissions_seeder.run(roleMap, permissionMap);
      this.logger.log('Role-permissions seeded');

      // 4. Seed admin account (creates default admin user with Admin role)
      // Note: Admin role already has all permissions via role-permission links
      const admin_seeder = new SeedAdminAccount(query_runner.manager);
      await admin_seeder.run(roleMap);
      this.logger.log('Admin account seeded');

      // 5. Seed reference data (employment, branches, locations, education, etc.)
      await new SeedEmploymentTypes(query_runner.manager).run();
      await new SeedEmploymentStatuses(query_runner.manager).run();
      await new SeedCivilStatuses(query_runner.manager).run();
      await new SeedReligions(query_runner.manager).run();
      await new SeedCitizenships(query_runner.manager).run();
      await new SeedLeaveTypes(query_runner.manager).run();
      await new SeedBranches(query_runner.manager).run();
      await new SeedDepartments(query_runner.manager).run();
      await new SeedJobTitles(query_runner.manager).run();
      await new SeedProvinces(query_runner.manager).run();
      await new SeedCities(query_runner.manager).run();
      await new SeedBarangays(query_runner.manager).run();
      await new SeedEducationLevels(query_runner.manager).run();
      await new SeedEducationSchools(query_runner.manager).run();
      await new SeedEducationCourses(query_runner.manager).run();
      await new SeedEducationCourseLevels(query_runner.manager).run();
      await new SeedWorkExperienceCompanies(query_runner.manager).run();
      await new SeedWorkExperienceJobTitles(query_runner.manager).run();
      await new SeedTrainingCertificates(query_runner.manager).run();
      await new SeedHolidays(query_runner.manager).run();
      this.logger.log('Reference data seeded');

      // Commit the transaction if all seeds succeed
      await query_runner.commitTransaction();
      this.logger.log('All seeds executed successfully.');
    } catch (error) {
      // Rollback transaction in case of error
      await query_runner.rollbackTransaction();
      this.logger.error(
        'Error during seeding, transaction rolled back:',
        error,
      );
      throw error;
    } finally {
      // Release the query runner and close the database connection
      await query_runner.release();
      await this.data_source.destroy();
      this.logger.debug('Seeder Database closed successfully.');
    }
  }
}

// Execute the seed runner
new SeedRunner(data_source).run();
