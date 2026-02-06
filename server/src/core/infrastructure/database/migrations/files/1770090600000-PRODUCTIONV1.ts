import { MigrationInterface, QueryRunner } from 'typeorm';

export class PRODUCTIONV11770090600000 implements MigrationInterface {
  name = 'PRODUCTIONV11770090600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "educations" (
        "id" SERIAL NOT NULL,
        "employee_id" integer NOT NULL,
        "education_school_id" integer NOT NULL,
        "education_school" character varying(255),
        "education_level_id" integer NOT NULL,
        "education_level" character varying(255),
        "education_course_id" integer,
        "education_course" character varying(255),
        "education_course_level_id" integer,
        "education_course_level" character varying(255),
        "school_year" character varying(50) NOT NULL,
        "deleted_by" character varying(255),
        "deleted_at" TIMESTAMP,
        "created_by" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_by" character varying(255),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_educations" PRIMARY KEY ("id")
      );
      COMMENT ON COLUMN "educations"."employee_id" IS 'Employee ID';
      COMMENT ON COLUMN "educations"."education_school_id" IS 'Education school ID';
      COMMENT ON COLUMN "educations"."education_school" IS 'Education school name (denormalized)';
      COMMENT ON COLUMN "educations"."education_level_id" IS 'Education level ID';
      COMMENT ON COLUMN "educations"."education_level" IS 'Education level name (denormalized)';
      COMMENT ON COLUMN "educations"."education_course_id" IS 'Education course ID';
      COMMENT ON COLUMN "educations"."education_course" IS 'Education course name (denormalized)';
      COMMENT ON COLUMN "educations"."education_course_level_id" IS 'Education course level ID';
      COMMENT ON COLUMN "educations"."education_course_level" IS 'Education course level name (denormalized)';
      COMMENT ON COLUMN "educations"."school_year" IS 'School year';
      COMMENT ON COLUMN "educations"."deleted_by" IS 'User who deleted the education';
      COMMENT ON COLUMN "educations"."created_by" IS 'User who created the education';
      COMMENT ON COLUMN "educations"."updated_by" IS 'User who last updated the education'
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_educations_employee_id" ON "educations" ("employee_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_educations_education_school_id" ON "educations" ("education_school_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_educations_education_level_id" ON "educations" ("education_level_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_educations_education_course_id" ON "educations" ("education_course_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_educations_education_course_level_id" ON "educations" ("education_course_level_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_educations_deleted_at" ON "educations" ("deleted_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_educations_deleted_at"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_educations_education_course_level_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_educations_education_course_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_educations_education_level_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_educations_education_school_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_educations_employee_id"`,
    );
    await queryRunner.query(`DROP TABLE "educations"`);
  }
}
