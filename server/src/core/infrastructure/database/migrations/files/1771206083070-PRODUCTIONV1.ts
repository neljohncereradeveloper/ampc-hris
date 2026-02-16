import { MigrationInterface, QueryRunner } from "typeorm";

export class PRODUCTIONV11771206083070 implements MigrationInterface {
    name = 'PRODUCTIONV11771206083070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "leave_policies" (
                "id" SERIAL NOT NULL,
                "leave_type_id" integer NOT NULL,
                "annual_entitlement" numeric(8, 2) NOT NULL,
                "carry_limit" numeric(8, 2) NOT NULL DEFAULT '0',
                "encash_limit" numeric(8, 2) NOT NULL DEFAULT '0',
                "carried_over_years" integer NOT NULL DEFAULT '0',
                "effective_date" date,
                "expiry_date" date,
                "status" character varying(50) NOT NULL,
                "remarks" character varying(500),
                "minimum_service_months" integer,
                "allowed_employment_types" jsonb,
                "allowed_employee_statuses" jsonb,
                "excluded_weekdays" jsonb,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_7d3b46bd2974cbb56e3831f3f34" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "leave_policies"."leave_type_id" IS 'Leave type this policy applies to';
            COMMENT ON COLUMN "leave_policies"."annual_entitlement" IS 'Days granted per year';
            COMMENT ON COLUMN "leave_policies"."carry_limit" IS 'Max days carry over';
            COMMENT ON COLUMN "leave_policies"."encash_limit" IS 'Max days encashable per year';
            COMMENT ON COLUMN "leave_policies"."carried_over_years" IS 'Years from which carry over allowed';
            COMMENT ON COLUMN "leave_policies"."effective_date" IS 'Effective date';
            COMMENT ON COLUMN "leave_policies"."expiry_date" IS 'Expiry/retirement date';
            COMMENT ON COLUMN "leave_policies"."status" IS 'Status: draft, active, inactive, retired';
            COMMENT ON COLUMN "leave_policies"."remarks" IS 'Remarks';
            COMMENT ON COLUMN "leave_policies"."minimum_service_months" IS 'Minimum service months';
            COMMENT ON COLUMN "leave_policies"."allowed_employment_types" IS 'Allowed employment types';
            COMMENT ON COLUMN "leave_policies"."allowed_employee_statuses" IS 'Allowed employee statuses';
            COMMENT ON COLUMN "leave_policies"."excluded_weekdays" IS 'Excluded weekdays (0-6)';
            COMMENT ON COLUMN "leave_policies"."deleted_by" IS 'User who deleted the record';
            COMMENT ON COLUMN "leave_policies"."created_by" IS 'User who created the record';
            COMMENT ON COLUMN "leave_policies"."updated_by" IS 'User who last updated the record'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_145159e6d88d26843a8f9a0928" ON "leave_policies" ("leave_type_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_58654675a02a52a8eb8dc8196b" ON "leave_policies" ("status")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_9ab2dbb388b1a0cefdc31b6ee7" ON "leave_policies" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "leave_encashments" (
                "id" SERIAL NOT NULL,
                "employee_id" integer NOT NULL,
                "balance_id" integer NOT NULL,
                "total_days" numeric(5, 2) NOT NULL,
                "amount" numeric(12, 2) NOT NULL,
                "status" character varying(50) NOT NULL,
                "payroll_ref" character varying(255),
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_98a73ac31d3a5383374f0de8693" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "leave_encashments"."employee_id" IS 'Employee';
            COMMENT ON COLUMN "leave_encashments"."balance_id" IS 'Balance to debit';
            COMMENT ON COLUMN "leave_encashments"."total_days" IS 'Days encashed';
            COMMENT ON COLUMN "leave_encashments"."amount" IS 'Amount paid';
            COMMENT ON COLUMN "leave_encashments"."status" IS 'Status: pending, paid, cancelled';
            COMMENT ON COLUMN "leave_encashments"."payroll_ref" IS 'Payroll reference (when paid)';
            COMMENT ON COLUMN "leave_encashments"."deleted_by" IS 'User who deleted the record';
            COMMENT ON COLUMN "leave_encashments"."created_by" IS 'User who created the record';
            COMMENT ON COLUMN "leave_encashments"."updated_by" IS 'User who last updated the record'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_2821677265a960623393291fb7" ON "leave_encashments" ("employee_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fd446a1515726ee44dc228efc0" ON "leave_encashments" ("balance_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_65150b172790b6dfca5827c8d6" ON "leave_encashments" ("status")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_89c1433ce9b451a2ac110c4592" ON "leave_encashments" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "leave_transactions" (
                "id" SERIAL NOT NULL,
                "balance_id" integer NOT NULL,
                "transaction_type" character varying(50) NOT NULL,
                "days" numeric(8, 2) NOT NULL,
                "remarks" character varying(500) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a195318dcddaa307e86a557ec96" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "leave_transactions"."balance_id" IS 'Balance affected';
            COMMENT ON COLUMN "leave_transactions"."transaction_type" IS 'Type: request, encashment, adjustment, carry';
            COMMENT ON COLUMN "leave_transactions"."days" IS 'Days (signed)';
            COMMENT ON COLUMN "leave_transactions"."remarks" IS 'Remarks';
            COMMENT ON COLUMN "leave_transactions"."deleted_by" IS 'User who deleted the record';
            COMMENT ON COLUMN "leave_transactions"."created_by" IS 'User who created the record';
            COMMENT ON COLUMN "leave_transactions"."updated_by" IS 'User who last updated the record'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_c51ea3762632ff30245b00173c" ON "leave_transactions" ("balance_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_6b409e131857f597862c7806a4" ON "leave_transactions" ("transaction_type")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e11b9ea35596d3ec51f48d719e" ON "leave_transactions" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "leave_balances" (
                "id" SERIAL NOT NULL,
                "employee_id" integer NOT NULL,
                "leave_type_id" integer NOT NULL,
                "policy_id" integer NOT NULL,
                "year" character varying(50) NOT NULL,
                "beginning_balance" numeric(8, 2) NOT NULL DEFAULT '0',
                "earned" numeric(8, 2) NOT NULL DEFAULT '0',
                "used" numeric(8, 2) NOT NULL DEFAULT '0',
                "carried_over" numeric(8, 2) NOT NULL DEFAULT '0',
                "encashed" numeric(8, 2) NOT NULL DEFAULT '0',
                "remaining" numeric(8, 2) NOT NULL DEFAULT '0',
                "last_transaction_date" TIMESTAMP,
                "status" character varying(50) NOT NULL,
                "remarks" character varying(500),
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a1d90dff48fb2bfd23a7163d077" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "leave_balances"."employee_id" IS 'Employee who owns this balance';
            COMMENT ON COLUMN "leave_balances"."leave_type_id" IS 'Leave type';
            COMMENT ON COLUMN "leave_balances"."policy_id" IS 'Policy defining entitlement';
            COMMENT ON COLUMN "leave_balances"."year" IS 'Leave year (e.g. 2025)';
            COMMENT ON COLUMN "leave_balances"."beginning_balance" IS 'Opening balance at year start';
            COMMENT ON COLUMN "leave_balances"."earned" IS 'Days earned this year';
            COMMENT ON COLUMN "leave_balances"."used" IS 'Days used (approved leave)';
            COMMENT ON COLUMN "leave_balances"."carried_over" IS 'Days carried over';
            COMMENT ON COLUMN "leave_balances"."encashed" IS 'Days encashed';
            COMMENT ON COLUMN "leave_balances"."remaining" IS 'Available days';
            COMMENT ON COLUMN "leave_balances"."last_transaction_date" IS 'Last transaction date';
            COMMENT ON COLUMN "leave_balances"."status" IS 'Status: open, closed, reopened, finalized';
            COMMENT ON COLUMN "leave_balances"."remarks" IS 'Remarks';
            COMMENT ON COLUMN "leave_balances"."deleted_by" IS 'User who deleted the record';
            COMMENT ON COLUMN "leave_balances"."created_by" IS 'User who created the record';
            COMMENT ON COLUMN "leave_balances"."updated_by" IS 'User who last updated the record'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_2f8aebce74941a2e2168e94ba6" ON "leave_balances" ("employee_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_d64da0a991d2f4d23d86031530" ON "leave_balances" ("leave_type_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_850f79e88be1e40b56b19a7caa" ON "leave_balances" ("policy_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f6c1efb1249c28a530ae2ee877" ON "leave_balances" ("year")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ae8e10438560e6d6f8e50f8fa4" ON "leave_balances" ("status")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_9daeca01e053cd8bc50047ff27" ON "leave_balances" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "leave_requests" (
                "id" SERIAL NOT NULL,
                "employee_id" integer NOT NULL,
                "leave_type_id" integer NOT NULL,
                "start_date" date NOT NULL,
                "end_date" date NOT NULL,
                "total_days" numeric(5, 2) NOT NULL,
                "reason" character varying(500) NOT NULL,
                "balance_id" integer NOT NULL,
                "approval_date" TIMESTAMP,
                "approval_by" integer,
                "remarks" character varying(500),
                "status" character varying(50) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_d3abcf9a16cef1450129e06fa9f" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "leave_requests"."employee_id" IS 'Employee requesting leave';
            COMMENT ON COLUMN "leave_requests"."leave_type_id" IS 'Leave type (e.g. VL, SL)';
            COMMENT ON COLUMN "leave_requests"."start_date" IS 'First day of leave period';
            COMMENT ON COLUMN "leave_requests"."end_date" IS 'Last day of leave period';
            COMMENT ON COLUMN "leave_requests"."total_days" IS 'Number of leave days';
            COMMENT ON COLUMN "leave_requests"."reason" IS 'Reason for leave';
            COMMENT ON COLUMN "leave_requests"."balance_id" IS 'Leave balance to debit';
            COMMENT ON COLUMN "leave_requests"."approval_date" IS 'When approved/rejected';
            COMMENT ON COLUMN "leave_requests"."approval_by" IS 'User who approved/rejected';
            COMMENT ON COLUMN "leave_requests"."remarks" IS 'Remarks';
            COMMENT ON COLUMN "leave_requests"."status" IS 'Status: pending, approved, rejected, cancelled';
            COMMENT ON COLUMN "leave_requests"."deleted_by" IS 'User who deleted the record';
            COMMENT ON COLUMN "leave_requests"."created_by" IS 'User who created the record';
            COMMENT ON COLUMN "leave_requests"."updated_by" IS 'User who last updated the record'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_52b4b7c7d295e204add6dbe0a0" ON "leave_requests" ("employee_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_54a57db316598806786c2b9532" ON "leave_requests" ("leave_type_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_60d520988058c030799a398034" ON "leave_requests" ("balance_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a9cc5df6df50aed58f4d84aa4f" ON "leave_requests" ("status")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_553325fc644d5b40c1c371377b" ON "leave_requests" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "leave_year_configurations" (
                "id" SERIAL NOT NULL,
                "cutoff_start_date" date NOT NULL,
                "cutoff_end_date" date NOT NULL,
                "year" character varying(50) NOT NULL,
                "remarks" character varying(500),
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_3f459288a6bf92dc91ee1044375" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "leave_year_configurations"."cutoff_start_date" IS 'Leave year start';
            COMMENT ON COLUMN "leave_year_configurations"."cutoff_end_date" IS 'Leave year end';
            COMMENT ON COLUMN "leave_year_configurations"."year" IS 'Year label (e.g. 2025)';
            COMMENT ON COLUMN "leave_year_configurations"."remarks" IS 'Remarks';
            COMMENT ON COLUMN "leave_year_configurations"."deleted_by" IS 'User who deleted the record';
            COMMENT ON COLUMN "leave_year_configurations"."created_by" IS 'User who created the record';
            COMMENT ON COLUMN "leave_year_configurations"."updated_by" IS 'User who last updated the record'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4a16ad30daf26acd53a6bcf49a" ON "leave_year_configurations" ("year")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4f4513707f8724f8ce33086d76" ON "leave_year_configurations" ("deleted_at")
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_types"
            ADD "name" character varying(100) NOT NULL
        `);
        await queryRunner.query(`
            COMMENT ON COLUMN "leave_types"."name" IS 'Leave type name'
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_types"
            ADD "code" character varying(50) NOT NULL
        `);
        await queryRunner.query(`
            COMMENT ON COLUMN "leave_types"."code" IS 'Short code (e.g. VL, SL)'
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_types"
            ADD "paid" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            COMMENT ON COLUMN "leave_types"."paid" IS 'Whether this leave type is paid'
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_types"
            ADD "remarks" character varying(500)
        `);
        await queryRunner.query(`
            COMMENT ON COLUMN "leave_types"."remarks" IS 'Optional remarks'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e41bb9537ef5e65ee2de2cfa81" ON "leave_types" ("name")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_600530eb1d9f853dd746e5819c" ON "leave_types" ("code")
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_policies"
            ADD CONSTRAINT "FK_145159e6d88d26843a8f9a0928b" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_encashments"
            ADD CONSTRAINT "FK_2821677265a960623393291fb79" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_encashments"
            ADD CONSTRAINT "FK_fd446a1515726ee44dc228efc00" FOREIGN KEY ("balance_id") REFERENCES "leave_balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_transactions"
            ADD CONSTRAINT "FK_c51ea3762632ff30245b00173cf" FOREIGN KEY ("balance_id") REFERENCES "leave_balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_balances"
            ADD CONSTRAINT "FK_2f8aebce74941a2e2168e94ba68" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_balances"
            ADD CONSTRAINT "FK_d64da0a991d2f4d23d86031530c" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_balances"
            ADD CONSTRAINT "FK_850f79e88be1e40b56b19a7caad" FOREIGN KEY ("policy_id") REFERENCES "leave_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_requests"
            ADD CONSTRAINT "FK_52b4b7c7d295e204add6dbe0a09" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_requests"
            ADD CONSTRAINT "FK_54a57db316598806786c2b95323" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_requests"
            ADD CONSTRAINT "FK_60d520988058c030799a3980349" FOREIGN KEY ("balance_id") REFERENCES "leave_balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "leave_requests" DROP CONSTRAINT "FK_60d520988058c030799a3980349"
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_requests" DROP CONSTRAINT "FK_54a57db316598806786c2b95323"
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_requests" DROP CONSTRAINT "FK_52b4b7c7d295e204add6dbe0a09"
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_balances" DROP CONSTRAINT "FK_850f79e88be1e40b56b19a7caad"
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_balances" DROP CONSTRAINT "FK_d64da0a991d2f4d23d86031530c"
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_balances" DROP CONSTRAINT "FK_2f8aebce74941a2e2168e94ba68"
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_transactions" DROP CONSTRAINT "FK_c51ea3762632ff30245b00173cf"
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_encashments" DROP CONSTRAINT "FK_fd446a1515726ee44dc228efc00"
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_encashments" DROP CONSTRAINT "FK_2821677265a960623393291fb79"
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_policies" DROP CONSTRAINT "FK_145159e6d88d26843a8f9a0928b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_600530eb1d9f853dd746e5819c"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e41bb9537ef5e65ee2de2cfa81"
        `);
        await queryRunner.query(`
            COMMENT ON COLUMN "leave_types"."remarks" IS 'Optional remarks'
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_types" DROP COLUMN "remarks"
        `);
        await queryRunner.query(`
            COMMENT ON COLUMN "leave_types"."paid" IS 'Whether this leave type is paid'
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_types" DROP COLUMN "paid"
        `);
        await queryRunner.query(`
            COMMENT ON COLUMN "leave_types"."code" IS 'Short code (e.g. VL, SL)'
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_types" DROP COLUMN "code"
        `);
        await queryRunner.query(`
            COMMENT ON COLUMN "leave_types"."name" IS 'Leave type name'
        `);
        await queryRunner.query(`
            ALTER TABLE "leave_types" DROP COLUMN "name"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_4f4513707f8724f8ce33086d76"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_4a16ad30daf26acd53a6bcf49a"
        `);
        await queryRunner.query(`
            DROP TABLE "leave_year_configurations"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_553325fc644d5b40c1c371377b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a9cc5df6df50aed58f4d84aa4f"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_60d520988058c030799a398034"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_54a57db316598806786c2b9532"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_52b4b7c7d295e204add6dbe0a0"
        `);
        await queryRunner.query(`
            DROP TABLE "leave_requests"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_9daeca01e053cd8bc50047ff27"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ae8e10438560e6d6f8e50f8fa4"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f6c1efb1249c28a530ae2ee877"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_850f79e88be1e40b56b19a7caa"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_d64da0a991d2f4d23d86031530"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_2f8aebce74941a2e2168e94ba6"
        `);
        await queryRunner.query(`
            DROP TABLE "leave_balances"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e11b9ea35596d3ec51f48d719e"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_6b409e131857f597862c7806a4"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_c51ea3762632ff30245b00173c"
        `);
        await queryRunner.query(`
            DROP TABLE "leave_transactions"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_89c1433ce9b451a2ac110c4592"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_65150b172790b6dfca5827c8d6"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_fd446a1515726ee44dc228efc0"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_2821677265a960623393291fb7"
        `);
        await queryRunner.query(`
            DROP TABLE "leave_encashments"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_9ab2dbb388b1a0cefdc31b6ee7"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_58654675a02a52a8eb8dc8196b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_145159e6d88d26843a8f9a0928"
        `);
        await queryRunner.query(`
            DROP TABLE "leave_policies"
        `);
    }

}
