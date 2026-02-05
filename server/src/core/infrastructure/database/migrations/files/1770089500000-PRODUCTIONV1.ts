import { MigrationInterface, QueryRunner } from 'typeorm';

export class PRODUCTIONV11770089500000 implements MigrationInterface {
  name = 'PRODUCTIONV11770089500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "cities" (
        "id" SERIAL NOT NULL,
        "desc1" character varying(255) NOT NULL,
        "deleted_by" character varying(255),
        "deleted_at" TIMESTAMP,
        "created_by" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_by" character varying(255),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cities" PRIMARY KEY ("id")
      );
      COMMENT ON COLUMN "cities"."desc1" IS 'City description (desc1)';
      COMMENT ON COLUMN "cities"."deleted_by" IS 'User who deleted the city';
      COMMENT ON COLUMN "cities"."created_by" IS 'User who created the city';
      COMMENT ON COLUMN "cities"."updated_by" IS 'User who last updated the city'
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_cities_desc1" ON "cities" ("desc1")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_cities_deleted_at" ON "cities" ("deleted_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_cities_deleted_at"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cities_desc1"`);
    await queryRunner.query(`DROP TABLE "cities"`);
  }
}
