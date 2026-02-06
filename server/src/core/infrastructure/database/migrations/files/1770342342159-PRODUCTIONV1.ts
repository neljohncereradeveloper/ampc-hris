import { MigrationInterface, QueryRunner } from "typeorm";

export class PRODUCTIONV11770342342159 implements MigrationInterface {
    name = 'PRODUCTIONV11770342342159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "leave_types" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_359223e0755d19711813cd07394" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "leave_types"."desc1" IS 'Leave type description (desc1)';
            COMMENT ON COLUMN "leave_types"."deleted_by" IS 'User who deleted the leave type';
            COMMENT ON COLUMN "leave_types"."created_by" IS 'User who created the leave type';
            COMMENT ON COLUMN "leave_types"."updated_by" IS 'User who last updated the leave type'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_d663d489d70ad250328d45099a" ON "leave_types" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_71a16d94fd7399d782601665ad" ON "leave_types" ("deleted_at")
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_6c2c0d1bd40858634fa4875c7c9" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_6c2c0d1bd40858634fa4875c7c9"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_71a16d94fd7399d782601665ad"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_d663d489d70ad250328d45099a"
        `);
        await queryRunner.query(`
            DROP TABLE "leave_types"
        `);
    }

}
