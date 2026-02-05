import { MigrationInterface, QueryRunner } from 'typeorm';

export class PRODUCTIONV11770090500000 implements MigrationInterface {
  name = 'PRODUCTIONV11770090500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "civil_statuses" (
        "id" SERIAL NOT NULL,
        "desc1" character varying(255) NOT NULL,
        "deleted_by" character varying(255),
        "deleted_at" TIMESTAMP,
        "created_by" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_by" character varying(255),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_civil_statuses" PRIMARY KEY ("id")
      );
      COMMENT ON COLUMN "civil_statuses"."desc1" IS 'Civil status description (desc1)';
      COMMENT ON COLUMN "civil_statuses"."deleted_by" IS 'User who deleted the civil status';
      COMMENT ON COLUMN "civil_statuses"."created_by" IS 'User who created the civil status';
      COMMENT ON COLUMN "civil_statuses"."updated_by" IS 'User who last updated the civil status'
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_civil_statuses_desc1" ON "civil_statuses" ("desc1")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_civil_statuses_deleted_at" ON "civil_statuses" ("deleted_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_civil_statuses_deleted_at"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_civil_statuses_desc1"`,
    );
    await queryRunner.query(`DROP TABLE "civil_statuses"`);
  }
}
