import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLeaveTypeNameCodePaidRemarks1771029669862
  implements MigrationInterface
{
  name = 'AddLeaveTypeNameCodePaidRemarks1771029669862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "leave_types"
      ADD COLUMN "name" character varying(100),
      ADD COLUMN "code" character varying(50),
      ADD COLUMN "paid" boolean DEFAULT true,
      ADD COLUMN "remarks" character varying(500)
    `);

    await queryRunner.query(`
      UPDATE "leave_types"
      SET "name" = "desc1",
        "code" = 'LT' || "id",
        "paid" = COALESCE("paid", true)
      WHERE "name" IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "leave_types"
      ALTER COLUMN "name" SET NOT NULL,
      ALTER COLUMN "code" SET NOT NULL
    `);

    await queryRunner.query(`
      COMMENT ON COLUMN "leave_types"."name" IS 'Leave type name'
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN "leave_types"."code" IS 'Short code (e.g. VL, SL)'
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN "leave_types"."paid" IS 'Whether this leave type is paid'
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN "leave_types"."remarks" IS 'Optional remarks'
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_leave_types_name" ON "leave_types" ("name")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_leave_types_code" ON "leave_types" ("code")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_leave_types_code"`);
    await queryRunner.query(`DROP INDEX "IDX_leave_types_name"`);
    await queryRunner.query(`
      ALTER TABLE "leave_types"
      DROP COLUMN "remarks",
      DROP COLUMN "paid",
      DROP COLUMN "code",
      DROP COLUMN "name"
    `);
  }
}
