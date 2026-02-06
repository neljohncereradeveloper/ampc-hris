import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds audit columns (deleted_by, deleted_at, created_by, updated_by) to leave_types
 * to match the jobtitle/branch pattern for soft delete and audit trail.
 */
export class AddLeaveTypesAuditColumns1770341323859 implements MigrationInterface {
  name = 'AddLeaveTypesAuditColumns1770341323859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "leave_types"
      ADD COLUMN IF NOT EXISTS "deleted_by" character varying(255),
      ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "created_by" character varying(255),
      ADD COLUMN IF NOT EXISTS "updated_by" character varying(255)
    `);
    await queryRunner.query(
      `COMMENT ON COLUMN "leave_types"."deleted_by" IS 'User who deleted the leave type'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "leave_types"."created_by" IS 'User who created the leave type'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "leave_types"."updated_by" IS 'User who last updated the leave type'`,
    );
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_leave_types_deleted_at" ON "leave_types" ("deleted_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_leave_types_deleted_at"`);
    await queryRunner.query(`
      ALTER TABLE "leave_types"
      DROP COLUMN IF EXISTS "deleted_by",
      DROP COLUMN IF EXISTS "deleted_at",
      DROP COLUMN IF EXISTS "created_by",
      DROP COLUMN IF EXISTS "updated_by"
    `);
  }
}
