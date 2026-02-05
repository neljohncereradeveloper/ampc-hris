import { MigrationInterface, QueryRunner } from 'typeorm';

export class PRODUCTIONV11770089000000 implements MigrationInterface {
  name = 'PRODUCTIONV11770089000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "barangays" (
        "id" SERIAL NOT NULL,
        "desc1" character varying(255) NOT NULL,
        "deleted_by" character varying(255),
        "deleted_at" TIMESTAMP,
        "created_by" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_by" character varying(255),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_barangays" PRIMARY KEY ("id")
      );
      COMMENT ON COLUMN "barangays"."desc1" IS 'Barangay description (desc1)';
      COMMENT ON COLUMN "barangays"."deleted_by" IS 'User who deleted the barangay';
      COMMENT ON COLUMN "barangays"."created_by" IS 'User who created the barangay';
      COMMENT ON COLUMN "barangays"."updated_by" IS 'User who last updated the barangay'
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_barangays_desc1" ON "barangays" ("desc1")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_barangays_deleted_at" ON "barangays" ("deleted_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_barangays_deleted_at"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_barangays_desc1"`);
    await queryRunner.query(`DROP TABLE "barangays"`);
  }
}
