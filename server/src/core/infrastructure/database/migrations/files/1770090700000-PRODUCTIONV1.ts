import { MigrationInterface, QueryRunner } from 'typeorm';

export class PRODUCTIONV11770090700000 implements MigrationInterface {
  name = 'PRODUCTIONV11770090700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "educations" DROP COLUMN IF EXISTS "education_school"`,
    );
    await queryRunner.query(
      `ALTER TABLE "educations" DROP COLUMN IF EXISTS "education_level"`,
    );
    await queryRunner.query(
      `ALTER TABLE "educations" DROP COLUMN IF EXISTS "education_course"`,
    );
    await queryRunner.query(
      `ALTER TABLE "educations" DROP COLUMN IF EXISTS "education_course_level"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "educations" ADD "education_course_level" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "educations" ADD "education_course" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "educations" ADD "education_level" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "educations" ADD "education_school" character varying(255)`,
    );
  }
}
