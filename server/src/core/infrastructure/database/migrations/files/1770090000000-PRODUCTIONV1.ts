import { MigrationInterface, QueryRunner } from 'typeorm';

export class PRODUCTIONV11770090000000 implements MigrationInterface {
  name = 'PRODUCTIONV11770090000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "citizenships" (
        "id" SERIAL NOT NULL,
        "desc1" character varying(255) NOT NULL,
        "deleted_by" character varying(255),
        "deleted_at" TIMESTAMP,
        "created_by" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_by" character varying(255),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_citizenships" PRIMARY KEY ("id")
      );
      COMMENT ON COLUMN "citizenships"."desc1" IS 'Citizenship description (desc1)';
      COMMENT ON COLUMN "citizenships"."deleted_by" IS 'User who deleted the citizenship';
      COMMENT ON COLUMN "citizenships"."created_by" IS 'User who created the citizenship';
      COMMENT ON COLUMN "citizenships"."updated_by" IS 'User who last updated the citizenship'
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_citizenships_desc1" ON "citizenships" ("desc1")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_citizenships_deleted_at" ON "citizenships" ("deleted_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_citizenships_deleted_at"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_citizenships_desc1"`);
    await queryRunner.query(`DROP TABLE "citizenships"`);
  }
}
