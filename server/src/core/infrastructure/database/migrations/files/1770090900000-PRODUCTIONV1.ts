import { MigrationInterface, QueryRunner } from 'typeorm';

export class PRODUCTIONV11770090900000 implements MigrationInterface {
  name = 'PRODUCTIONV11770090900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "work_experiences" DROP COLUMN IF EXISTS "company"`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_experiences" DROP COLUMN IF EXISTS "work_experience_job_title"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "work_experiences" ADD "work_experience_job_title" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_experiences" ADD "company" character varying(255)`,
    );
  }
}
