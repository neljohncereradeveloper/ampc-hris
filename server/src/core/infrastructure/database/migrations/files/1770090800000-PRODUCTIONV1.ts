import { MigrationInterface, QueryRunner } from 'typeorm';

export class PRODUCTIONV11770090800000 implements MigrationInterface {
  name = 'PRODUCTIONV11770090800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trainings" DROP COLUMN IF EXISTS "trainings_certificate"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trainings" ADD "trainings_certificate" character varying(255)`,
    );
  }
}
