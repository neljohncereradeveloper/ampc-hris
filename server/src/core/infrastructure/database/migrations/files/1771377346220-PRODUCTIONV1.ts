import { MigrationInterface, QueryRunner } from "typeorm";

export class PRODUCTIONV11771377346220 implements MigrationInterface {
    name = 'PRODUCTIONV11771377346220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "activitylog" (
                "id" SERIAL NOT NULL,
                "action" character varying(100) NOT NULL,
                "entity" character varying(100) NOT NULL,
                "details" json,
                "employee_id" integer,
                "occurred_at" TIMESTAMP NOT NULL DEFAULT now(),
                "request_info" json,
                CONSTRAINT "PK_45ea5194b66252c991f4f0794be" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f0215d2793f50225f63db488fd" ON "activitylog" ("occurred_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "user_permissions" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "permission_id" integer NOT NULL,
                "is_allowed" boolean NOT NULL,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_01f4295968ba33d73926684264f" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "user_permissions"."user_id" IS 'ID of the user';
            COMMENT ON COLUMN "user_permissions"."permission_id" IS 'ID of the permission';
            COMMENT ON COLUMN "user_permissions"."is_allowed" IS 'Whether the permission is allowed (true) or denied (false)';
            COMMENT ON COLUMN "user_permissions"."created_by" IS 'User who created the user-permission link'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_3495bd31f1862d02931e8e8d2e" ON "user_permissions" ("user_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_8145f5fadacd311693c15e41f1" ON "user_permissions" ("permission_id")
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_a537c48b1f80e8626a71cb5658" ON "user_permissions" ("user_id", "permission_id")
        `);
        await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" SERIAL NOT NULL,
                "name" character varying(255) NOT NULL,
                "resource" character varying(100) NOT NULL,
                "action" character varying(50) NOT NULL,
                "description" character varying(500),
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"),
                CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "permissions"."name" IS 'Unique name of the permission';
            COMMENT ON COLUMN "permissions"."resource" IS 'Resource that the permission applies to';
            COMMENT ON COLUMN "permissions"."action" IS 'Action that the permission allows';
            COMMENT ON COLUMN "permissions"."description" IS 'Description of the permission';
            COMMENT ON COLUMN "permissions"."deleted_by" IS 'User who deleted the permission';
            COMMENT ON COLUMN "permissions"."created_by" IS 'User who created the permission';
            COMMENT ON COLUMN "permissions"."updated_by" IS 'User who last updated the permission'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_48ce552495d14eae9b187bb671" ON "permissions" ("name")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_89456a09b598ce8915c702c528" ON "permissions" ("resource")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1c1e0637ecf1f6401beb9a68ab" ON "permissions" ("action")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1ea42cae477fc1dc619a5cd280" ON "permissions" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "role_permissions" (
                "id" SERIAL NOT NULL,
                "role_id" integer NOT NULL,
                "permission_id" integer NOT NULL,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "role_permissions"."role_id" IS 'ID of the role';
            COMMENT ON COLUMN "role_permissions"."permission_id" IS 'ID of the permission';
            COMMENT ON COLUMN "role_permissions"."created_by" IS 'User who created the role-permission link'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id")
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_25d24010f53bb80b78e412c965" ON "role_permissions" ("role_id", "permission_id")
        `);
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" SERIAL NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" character varying(500),
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"),
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "roles"."name" IS 'Unique name of the role';
            COMMENT ON COLUMN "roles"."description" IS 'Description of the role';
            COMMENT ON COLUMN "roles"."deleted_by" IS 'User who deleted the role';
            COMMENT ON COLUMN "roles"."created_by" IS 'User who created the role';
            COMMENT ON COLUMN "roles"."updated_by" IS 'User who last updated the role'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_7fd0c79dc4e6083ddea850ac38" ON "roles" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "role_id" integer NOT NULL,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "user_roles"."user_id" IS 'ID of the user';
            COMMENT ON COLUMN "user_roles"."role_id" IS 'ID of the role';
            COMMENT ON COLUMN "user_roles"."created_by" IS 'User who created the user-role link'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id")
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_23ed6f04fe43066df08379fd03" ON "user_roles" ("user_id", "role_id")
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "username" character varying(100) NOT NULL,
                "email" character varying(255) NOT NULL,
                "password" character varying(255),
                "first_name" character varying(100),
                "middle_name" character varying(100),
                "last_name" character varying(100),
                "phone" character varying(20),
                "date_of_birth" date,
                "is_active" boolean NOT NULL DEFAULT true,
                "is_email_verified" boolean NOT NULL DEFAULT false,
                "is_email_verified_at" TIMESTAMP,
                "change_password_by" character varying(255),
                "change_password_at" TIMESTAMP,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "users"."username" IS 'Unique username for the user';
            COMMENT ON COLUMN "users"."email" IS 'Unique email address for the user';
            COMMENT ON COLUMN "users"."password" IS 'Hashed password for the user';
            COMMENT ON COLUMN "users"."first_name" IS 'First name of the user';
            COMMENT ON COLUMN "users"."middle_name" IS 'Middle name of the user';
            COMMENT ON COLUMN "users"."last_name" IS 'Last name of the user';
            COMMENT ON COLUMN "users"."phone" IS 'Phone number of the user';
            COMMENT ON COLUMN "users"."date_of_birth" IS 'Date of birth of the user';
            COMMENT ON COLUMN "users"."is_active" IS 'Whether the user account is active';
            COMMENT ON COLUMN "users"."is_email_verified" IS 'Whether the user email is verified';
            COMMENT ON COLUMN "users"."is_email_verified_at" IS 'Timestamp when the email was verified';
            COMMENT ON COLUMN "users"."change_password_by" IS 'User who changed the password';
            COMMENT ON COLUMN "users"."change_password_at" IS 'Timestamp when the password was changed';
            COMMENT ON COLUMN "users"."deleted_by" IS 'User who deleted the user';
            COMMENT ON COLUMN "users"."created_by" IS 'User who created the user';
            COMMENT ON COLUMN "users"."updated_by" IS 'User who last updated the user'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_073999dfec9d14522f0cf58cd6" ON "users" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "branches" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "branches"."desc1" IS 'Branch description (desc1)';
            COMMENT ON COLUMN "branches"."deleted_by" IS 'User who deleted the branch';
            COMMENT ON COLUMN "branches"."created_by" IS 'User who created the branch';
            COMMENT ON COLUMN "branches"."updated_by" IS 'User who last updated the branch'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_2030d136f5302cedcb8f64f387" ON "branches" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_95185a2e3516c149ddf58faab5" ON "branches" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "departments" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "departments"."desc1" IS 'Department description (desc1)';
            COMMENT ON COLUMN "departments"."deleted_by" IS 'User who deleted the department';
            COMMENT ON COLUMN "departments"."created_by" IS 'User who created the department';
            COMMENT ON COLUMN "departments"."updated_by" IS 'User who last updated the department'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_8f232676ee7f0c19afb3b2fac9" ON "departments" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ea648afc7dd92d1402daac6964" ON "departments" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "jobtitles" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_616178574753ecb5eeacdae9769" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "jobtitles"."desc1" IS 'Jobtitle description (desc1)';
            COMMENT ON COLUMN "jobtitles"."deleted_by" IS 'User who deleted the jobtitle';
            COMMENT ON COLUMN "jobtitles"."created_by" IS 'User who created the jobtitle';
            COMMENT ON COLUMN "jobtitles"."updated_by" IS 'User who last updated the jobtitle'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f56835f98b091499412a78452b" ON "jobtitles" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e4cf0dd7de56eafd03f3eefe6f" ON "jobtitles" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "leave_types" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "code" character varying(50) NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "paid" boolean NOT NULL DEFAULT true,
                "remarks" character varying(500),
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_359223e0755d19711813cd07394" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "leave_types"."name" IS 'Leave type name';
            COMMENT ON COLUMN "leave_types"."code" IS 'Short code (e.g. VL, SL)';
            COMMENT ON COLUMN "leave_types"."desc1" IS 'Leave type description (desc1)';
            COMMENT ON COLUMN "leave_types"."paid" IS 'Whether this leave type is paid';
            COMMENT ON COLUMN "leave_types"."remarks" IS 'Optional remarks';
            COMMENT ON COLUMN "leave_types"."deleted_by" IS 'User who deleted the leave type';
            COMMENT ON COLUMN "leave_types"."created_by" IS 'User who created the leave type';
            COMMENT ON COLUMN "leave_types"."updated_by" IS 'User who last updated the leave type'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e41bb9537ef5e65ee2de2cfa81" ON "leave_types" ("name")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_600530eb1d9f853dd746e5819c" ON "leave_types" ("code")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_d663d489d70ad250328d45099a" ON "leave_types" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_71a16d94fd7399d782601665ad" ON "leave_types" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "employment_types" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_06f68172fbf4110e2a93fde677c" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "employment_types"."desc1" IS 'Employment type description (desc1)';
            COMMENT ON COLUMN "employment_types"."deleted_by" IS 'User who deleted the employment type';
            COMMENT ON COLUMN "employment_types"."created_by" IS 'User who created the employment type';
            COMMENT ON COLUMN "employment_types"."updated_by" IS 'User who last updated the employment type'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_d552d43a35242a27d6083aa38a" ON "employment_types" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_19b2b1267c479fff79c6b87341" ON "employment_types" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "employment_statuses" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ca68b42010dcd7e4160e707d245" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "employment_statuses"."desc1" IS 'Employment status description (desc1)';
            COMMENT ON COLUMN "employment_statuses"."deleted_by" IS 'User who deleted the employment status';
            COMMENT ON COLUMN "employment_statuses"."created_by" IS 'User who created the employment status';
            COMMENT ON COLUMN "employment_statuses"."updated_by" IS 'User who last updated the employment status'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_290c9acd82bf9fb0d3d219444d" ON "employment_statuses" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ed32d8ffc094bdfd0c6dc1213e" ON "employment_statuses" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "religions" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_5c576192fea37850ec9ed425bfe" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "religions"."desc1" IS 'Religion description (desc1)';
            COMMENT ON COLUMN "religions"."deleted_by" IS 'User who deleted the religion';
            COMMENT ON COLUMN "religions"."created_by" IS 'User who created the religion';
            COMMENT ON COLUMN "religions"."updated_by" IS 'User who last updated the religion'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_510a0e35e797c077644ae45812" ON "religions" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_7e6b7a59394fb8cd80dd2c52e8" ON "religions" ("deleted_at")
        `);
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
                CONSTRAINT "PK_ce1ead78c5e07c05e309f27ff08" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "civil_statuses"."desc1" IS 'Civil status description (desc1)';
            COMMENT ON COLUMN "civil_statuses"."deleted_by" IS 'User who deleted the civil status';
            COMMENT ON COLUMN "civil_statuses"."created_by" IS 'User who created the civil status';
            COMMENT ON COLUMN "civil_statuses"."updated_by" IS 'User who last updated the civil status'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4d2d16110092a8c085ac02082e" ON "civil_statuses" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_77adeb80be4ef059d1c8c209f5" ON "civil_statuses" ("deleted_at")
        `);
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
                CONSTRAINT "PK_647d9f413a430a1392db9ca4ef6" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "citizenships"."desc1" IS 'Citizenship description (desc1)';
            COMMENT ON COLUMN "citizenships"."deleted_by" IS 'User who deleted the citizenship';
            COMMENT ON COLUMN "citizenships"."created_by" IS 'User who created the citizenship';
            COMMENT ON COLUMN "citizenships"."updated_by" IS 'User who last updated the citizenship'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_cf101be39deef1f8cb244bc3f1" ON "citizenships" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a7483fdad50ba6886c77d67be7" ON "citizenships" ("deleted_at")
        `);
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
                CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "cities"."desc1" IS 'City description (desc1)';
            COMMENT ON COLUMN "cities"."deleted_by" IS 'User who deleted the city';
            COMMENT ON COLUMN "cities"."created_by" IS 'User who created the city';
            COMMENT ON COLUMN "cities"."updated_by" IS 'User who last updated the city'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_23719b4c0dc7abd923b5fe2d17" ON "cities" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f692aa0465e3a310358fadec5b" ON "cities" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "provinces" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_2e4260eedbcad036ec53222e0c7" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "provinces"."desc1" IS 'Province description (desc1)';
            COMMENT ON COLUMN "provinces"."deleted_by" IS 'User who deleted the province';
            COMMENT ON COLUMN "provinces"."created_by" IS 'User who created the province';
            COMMENT ON COLUMN "provinces"."updated_by" IS 'User who last updated the province'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_be632c6ce180f3ea65a7cd4b40" ON "provinces" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_24aebd19fae2f5eb8f2270fd23" ON "provinces" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "references" (
                "id" SERIAL NOT NULL,
                "employee_id" integer,
                "fname" character varying(100) NOT NULL,
                "mname" character varying(100),
                "lname" character varying(100) NOT NULL,
                "suffix" character varying(10),
                "cellphone_number" character varying(15),
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_795ec632ca1153bf5ec99d656e5" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "references"."employee_id" IS 'Employee ID';
            COMMENT ON COLUMN "references"."fname" IS 'First name';
            COMMENT ON COLUMN "references"."mname" IS 'Middle name';
            COMMENT ON COLUMN "references"."lname" IS 'Last name';
            COMMENT ON COLUMN "references"."suffix" IS 'Suffix';
            COMMENT ON COLUMN "references"."cellphone_number" IS 'Cellphone number';
            COMMENT ON COLUMN "references"."deleted_by" IS 'User who deleted the reference';
            COMMENT ON COLUMN "references"."created_by" IS 'User who created the reference';
            COMMENT ON COLUMN "references"."updated_by" IS 'User who last updated the reference'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_0ff32bc1409f2c78a9f90a9a9e" ON "references" ("employee_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_9eec2b9b2bd0a4d1a0403ddc6d" ON "references" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "training_certificates" (
                "id" SERIAL NOT NULL,
                "certificate_name" character varying(255) NOT NULL,
                "issuing_organization" character varying(255) NOT NULL,
                "issue_date" date NOT NULL,
                "expiry_date" date,
                "certificate_number" character varying(100),
                "file_path" character varying(500),
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_41aafad974c15231c5b318807bd" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "training_certificates"."certificate_name" IS 'Certificate name';
            COMMENT ON COLUMN "training_certificates"."issuing_organization" IS 'Issuing organization';
            COMMENT ON COLUMN "training_certificates"."issue_date" IS 'Issue date';
            COMMENT ON COLUMN "training_certificates"."expiry_date" IS 'Expiry date';
            COMMENT ON COLUMN "training_certificates"."certificate_number" IS 'Certificate number';
            COMMENT ON COLUMN "training_certificates"."file_path" IS 'Certificate file path';
            COMMENT ON COLUMN "training_certificates"."deleted_by" IS 'User who deleted the training certificate';
            COMMENT ON COLUMN "training_certificates"."created_by" IS 'User who created the training certificate';
            COMMENT ON COLUMN "training_certificates"."updated_by" IS 'User who last updated the training certificate'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ba133db940c05bc0b74d429dca" ON "training_certificates" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "trainings" (
                "id" SERIAL NOT NULL,
                "employee_id" integer,
                "training_date" date NOT NULL,
                "trainings_cert_id" integer NOT NULL,
                "training_title" character varying(100),
                "desc1" character varying(500),
                "image_path" character varying(500),
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_b67237502b175163e47dc85018d" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "trainings"."employee_id" IS 'Employee ID';
            COMMENT ON COLUMN "trainings"."training_date" IS 'Training date';
            COMMENT ON COLUMN "trainings"."trainings_cert_id" IS 'Training certificate ID';
            COMMENT ON COLUMN "trainings"."training_title" IS 'Training title';
            COMMENT ON COLUMN "trainings"."desc1" IS 'Description';
            COMMENT ON COLUMN "trainings"."image_path" IS 'Training image path';
            COMMENT ON COLUMN "trainings"."deleted_by" IS 'User who deleted the training';
            COMMENT ON COLUMN "trainings"."created_by" IS 'User who created the training';
            COMMENT ON COLUMN "trainings"."updated_by" IS 'User who last updated the training'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_3ade30bf6add2afef485844bd1" ON "trainings" ("employee_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_d35c1e210d58f9f885ec5557b8" ON "trainings" ("training_date")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b8e7bf47d6a5c692f49faba907" ON "trainings" ("trainings_cert_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_8c38927f20591fffb2a5fa2268" ON "trainings" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "work_experience_companies" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_533aec1563a4fbd04a5dc5c5947" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "work_experience_companies"."desc1" IS 'Work experience company description (desc1)';
            COMMENT ON COLUMN "work_experience_companies"."deleted_by" IS 'User who deleted the work experience company';
            COMMENT ON COLUMN "work_experience_companies"."created_by" IS 'User who created the work experience company';
            COMMENT ON COLUMN "work_experience_companies"."updated_by" IS 'User who last updated the work experience company'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_197eb16d21291ea9a785dfd452" ON "work_experience_companies" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_8e6ec4bc334f20c4940cc14496" ON "work_experience_companies" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "work_experience_jobtitles" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_76f619da4726a8e897be9a9bfff" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "work_experience_jobtitles"."desc1" IS 'Work experience job title description (desc1)';
            COMMENT ON COLUMN "work_experience_jobtitles"."deleted_by" IS 'User who deleted the work experience job title';
            COMMENT ON COLUMN "work_experience_jobtitles"."created_by" IS 'User who created the work experience job title';
            COMMENT ON COLUMN "work_experience_jobtitles"."updated_by" IS 'User who last updated the work experience job title'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_af59a8f41b8620756fd0aa71f9" ON "work_experience_jobtitles" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_db1e4079d62070d812e0c1ffd1" ON "work_experience_jobtitles" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "work_experiences" (
                "id" SERIAL NOT NULL,
                "employee_id" integer,
                "company_id" integer,
                "work_experience_job_title_id" integer,
                "years" character varying(50),
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_3189db15aaccc2861851ea3da17" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "work_experiences"."employee_id" IS 'Employee ID';
            COMMENT ON COLUMN "work_experiences"."company_id" IS 'Work experience company ID';
            COMMENT ON COLUMN "work_experiences"."work_experience_job_title_id" IS 'Work experience job title ID';
            COMMENT ON COLUMN "work_experiences"."years" IS 'Years of experience';
            COMMENT ON COLUMN "work_experiences"."deleted_by" IS 'User who deleted the work experience';
            COMMENT ON COLUMN "work_experiences"."created_by" IS 'User who created the work experience';
            COMMENT ON COLUMN "work_experiences"."updated_by" IS 'User who last updated the work experience'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e42c8f36b1dbaaa20d210efa16" ON "work_experiences" ("employee_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_3808b5a5551cc1296d1ae61ce9" ON "work_experiences" ("company_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_0a13c1782ea370c9dae9cc4563" ON "work_experiences" ("work_experience_job_title_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_d807498f89a5ec5275faee141e" ON "work_experiences" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "education_schools" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_90a9eee80216a03fc11f6789d31" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "education_schools"."desc1" IS 'Education school description (desc1)';
            COMMENT ON COLUMN "education_schools"."deleted_by" IS 'User who deleted the education school';
            COMMENT ON COLUMN "education_schools"."created_by" IS 'User who created the education school';
            COMMENT ON COLUMN "education_schools"."updated_by" IS 'User who last updated the education school'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_238182dc8788055aed1b232179" ON "education_schools" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_bec1852bb67f936454a6f73288" ON "education_schools" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "education_levels" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_87650fa9bdce80639107ce2ba23" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "education_levels"."desc1" IS 'Education level description (desc1)';
            COMMENT ON COLUMN "education_levels"."deleted_by" IS 'User who deleted the education level';
            COMMENT ON COLUMN "education_levels"."created_by" IS 'User who created the education level';
            COMMENT ON COLUMN "education_levels"."updated_by" IS 'User who last updated the education level'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a84d4759d79c4802f9f0bb3e2c" ON "education_levels" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ca36384b3322a7946e0058b0b4" ON "education_levels" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "education_courses" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_377def051f62adac847a0f45b2e" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "education_courses"."desc1" IS 'Education course description (desc1)';
            COMMENT ON COLUMN "education_courses"."deleted_by" IS 'User who deleted the education course';
            COMMENT ON COLUMN "education_courses"."created_by" IS 'User who created the education course';
            COMMENT ON COLUMN "education_courses"."updated_by" IS 'User who last updated the education course'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_0f76e660ce0e9272c5042686b2" ON "education_courses" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_62d97b4138cd94f82b2183d793" ON "education_courses" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "education_course_levels" (
                "id" SERIAL NOT NULL,
                "desc1" character varying(255) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_efc8ca4994fb281d12159581f14" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "education_course_levels"."desc1" IS 'Education course level description (desc1)';
            COMMENT ON COLUMN "education_course_levels"."deleted_by" IS 'User who deleted the education course level';
            COMMENT ON COLUMN "education_course_levels"."created_by" IS 'User who created the education course level';
            COMMENT ON COLUMN "education_course_levels"."updated_by" IS 'User who last updated the education course level'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_81ede785c07e5ca628844f6391" ON "education_course_levels" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b66ac22fd8dd3429877aca5c54" ON "education_course_levels" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "educations" (
                "id" SERIAL NOT NULL,
                "employee_id" integer NOT NULL,
                "education_school_id" integer NOT NULL,
                "education_level_id" integer NOT NULL,
                "education_course_id" integer,
                "education_course_level_id" integer,
                "school_year" character varying(50) NOT NULL,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_09d2f29e7f6f31f5c01d79d2dbf" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "educations"."employee_id" IS 'Employee ID';
            COMMENT ON COLUMN "educations"."education_school_id" IS 'Education school ID';
            COMMENT ON COLUMN "educations"."education_level_id" IS 'Education level ID';
            COMMENT ON COLUMN "educations"."education_course_id" IS 'Education course ID';
            COMMENT ON COLUMN "educations"."education_course_level_id" IS 'Education course level ID';
            COMMENT ON COLUMN "educations"."school_year" IS 'School year';
            COMMENT ON COLUMN "educations"."deleted_by" IS 'User who deleted the education';
            COMMENT ON COLUMN "educations"."created_by" IS 'User who created the education';
            COMMENT ON COLUMN "educations"."updated_by" IS 'User who last updated the education'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_338d5c2c7c90b753e7c83b8255" ON "educations" ("employee_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_8d9393b282b77f8a084ed8ffe4" ON "educations" ("education_school_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_56b14fb66ad38698b3e975ea7a" ON "educations" ("education_level_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_7435cab71e907ae2aa1e6c9def" ON "educations" ("education_course_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_997cf280b43d3b9931e28fcbd3" ON "educations" ("education_course_level_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_6d59d6504ed47efe8b377f0f91" ON "educations" ("deleted_at")
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."employees_gender_enum" AS ENUM('male', 'female')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."employees_pay_type_enum" AS ENUM('daily', 'monthly', 'hourly')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."employees_labor_classification_enum" AS ENUM('RANK AND FILE', 'SUPERVISORY', 'MANAGERIAL')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."employees_labor_classification_status_enum" AS ENUM('REGULAR', 'PROBATIONARY')
        `);
        await queryRunner.query(`
            CREATE TABLE "employees" (
                "id" SERIAL NOT NULL,
                "job_title_id" integer NOT NULL,
                "employment_type_id" integer NOT NULL,
                "employment_status_id" integer NOT NULL,
                "leave_type_id" integer,
                "branch_id" integer NOT NULL,
                "department_id" integer NOT NULL,
                "hire_date" date NOT NULL,
                "end_date" date,
                "regularization_date" date,
                "id_number" character varying(100) NOT NULL,
                "bio_number" character varying(100),
                "image_path" character varying(500),
                "first_name" character varying(100) NOT NULL,
                "middle_name" character varying(100),
                "last_name" character varying(100) NOT NULL,
                "suffix" character varying(10),
                "birth_date" date NOT NULL,
                "religion_id" integer NOT NULL,
                "civil_status_id" integer NOT NULL,
                "age" integer,
                "gender" "public"."employees_gender_enum",
                "citizen_ship_id" integer NOT NULL,
                "height" numeric(5, 2),
                "weight" numeric(5, 2),
                "home_address_street" character varying(255) NOT NULL,
                "home_address_barangay_id" integer NOT NULL,
                "home_address_city_id" integer NOT NULL,
                "home_address_province_id" integer NOT NULL,
                "home_address_zip_code" character varying(10) NOT NULL,
                "present_address_street" character varying(255),
                "present_address_barangay_id" integer,
                "present_address_city_id" integer,
                "present_address_province_id" integer,
                "present_address_zip_code" character varying(10),
                "cellphone_number" character varying(20),
                "telephone_number" character varying(20),
                "email" character varying(255),
                "emergency_contact_name" character varying(255),
                "emergency_contact_number" character varying(20),
                "emergency_contact_relationship" character varying(100),
                "emergency_contact_address" character varying(255),
                "husband_or_wife_name" character varying(255),
                "husband_or_wife_birth_date" date,
                "husband_or_wife_occupation" character varying(255),
                "number_of_children" integer,
                "fathers_name" character varying(255),
                "fathers_birth_date" date,
                "fathers_occupation" character varying(255),
                "mothers_name" character varying(255),
                "mothers_birth_date" date,
                "mothers_occupation" character varying(255),
                "bank_account_number" character varying(50),
                "bank_account_name" character varying(255),
                "bank_name" character varying(255),
                "bank_branch" character varying(255),
                "annual_salary" numeric(12, 2),
                "monthly_salary" numeric(12, 2),
                "daily_rate" numeric(12, 2),
                "hourly_rate" numeric(12, 2),
                "pay_type" "public"."employees_pay_type_enum",
                "phic" character varying(50),
                "hdmf" character varying(50),
                "sss_no" character varying(50),
                "tin_no" character varying(50),
                "tax_exempt_code" character varying(50),
                "is_active" boolean NOT NULL DEFAULT true,
                "labor_classification" "public"."employees_labor_classification_enum",
                "labor_classification_status" "public"."employees_labor_classification_status_enum",
                "remarks" text,
                "last_entry_date" date,
                "retention_expiry_date" date,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_ac3ea8b912600710aa0813f2d5f" UNIQUE ("id_number"),
                CONSTRAINT "UQ_2e155655b5b0c0cca0e1084c09f" UNIQUE ("bio_number"),
                CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "employees"."job_title_id" IS 'Job title ID';
            COMMENT ON COLUMN "employees"."employment_type_id" IS 'Employment type ID';
            COMMENT ON COLUMN "employees"."employment_status_id" IS 'Employment status ID';
            COMMENT ON COLUMN "employees"."leave_type_id" IS 'Leave type ID';
            COMMENT ON COLUMN "employees"."branch_id" IS 'Branch ID';
            COMMENT ON COLUMN "employees"."department_id" IS 'Department ID';
            COMMENT ON COLUMN "employees"."hire_date" IS 'Hire date';
            COMMENT ON COLUMN "employees"."end_date" IS 'End date';
            COMMENT ON COLUMN "employees"."regularization_date" IS 'Regularization date';
            COMMENT ON COLUMN "employees"."id_number" IS 'Employee ID number';
            COMMENT ON COLUMN "employees"."bio_number" IS 'Biometric number';
            COMMENT ON COLUMN "employees"."image_path" IS 'Employee image path';
            COMMENT ON COLUMN "employees"."first_name" IS 'First name';
            COMMENT ON COLUMN "employees"."middle_name" IS 'Middle name';
            COMMENT ON COLUMN "employees"."last_name" IS 'Last name';
            COMMENT ON COLUMN "employees"."suffix" IS 'Suffix';
            COMMENT ON COLUMN "employees"."birth_date" IS 'Birth date';
            COMMENT ON COLUMN "employees"."religion_id" IS 'Religion ID';
            COMMENT ON COLUMN "employees"."civil_status_id" IS 'Civil status ID';
            COMMENT ON COLUMN "employees"."age" IS 'Age';
            COMMENT ON COLUMN "employees"."gender" IS 'Gender';
            COMMENT ON COLUMN "employees"."citizen_ship_id" IS 'Citizenship ID';
            COMMENT ON COLUMN "employees"."height" IS 'Height';
            COMMENT ON COLUMN "employees"."weight" IS 'Weight';
            COMMENT ON COLUMN "employees"."home_address_street" IS 'Home address street';
            COMMENT ON COLUMN "employees"."home_address_barangay_id" IS 'Home address barangay ID';
            COMMENT ON COLUMN "employees"."home_address_city_id" IS 'Home address city ID';
            COMMENT ON COLUMN "employees"."home_address_province_id" IS 'Home address province ID';
            COMMENT ON COLUMN "employees"."home_address_zip_code" IS 'Home address zip code';
            COMMENT ON COLUMN "employees"."present_address_street" IS 'Present address street';
            COMMENT ON COLUMN "employees"."present_address_barangay_id" IS 'Present address barangay ID';
            COMMENT ON COLUMN "employees"."present_address_city_id" IS 'Present address city ID';
            COMMENT ON COLUMN "employees"."present_address_province_id" IS 'Present address province ID';
            COMMENT ON COLUMN "employees"."present_address_zip_code" IS 'Present address zip code';
            COMMENT ON COLUMN "employees"."cellphone_number" IS 'Cellphone number';
            COMMENT ON COLUMN "employees"."telephone_number" IS 'Telephone number';
            COMMENT ON COLUMN "employees"."email" IS 'Email address';
            COMMENT ON COLUMN "employees"."emergency_contact_name" IS 'Emergency contact name';
            COMMENT ON COLUMN "employees"."emergency_contact_number" IS 'Emergency contact number';
            COMMENT ON COLUMN "employees"."emergency_contact_relationship" IS 'Emergency contact relationship';
            COMMENT ON COLUMN "employees"."emergency_contact_address" IS 'Emergency contact address';
            COMMENT ON COLUMN "employees"."husband_or_wife_name" IS 'Husband or wife name';
            COMMENT ON COLUMN "employees"."husband_or_wife_birth_date" IS 'Husband or wife birth date';
            COMMENT ON COLUMN "employees"."husband_or_wife_occupation" IS 'Husband or wife occupation';
            COMMENT ON COLUMN "employees"."number_of_children" IS 'Number of children';
            COMMENT ON COLUMN "employees"."fathers_name" IS 'Fathers name';
            COMMENT ON COLUMN "employees"."fathers_birth_date" IS 'Fathers birth date';
            COMMENT ON COLUMN "employees"."fathers_occupation" IS 'Fathers occupation';
            COMMENT ON COLUMN "employees"."mothers_name" IS 'Mothers name';
            COMMENT ON COLUMN "employees"."mothers_birth_date" IS 'Mothers birth date';
            COMMENT ON COLUMN "employees"."mothers_occupation" IS 'Mothers occupation';
            COMMENT ON COLUMN "employees"."bank_account_number" IS 'Bank account number';
            COMMENT ON COLUMN "employees"."bank_account_name" IS 'Bank account name';
            COMMENT ON COLUMN "employees"."bank_name" IS 'Bank name';
            COMMENT ON COLUMN "employees"."bank_branch" IS 'Bank branch';
            COMMENT ON COLUMN "employees"."annual_salary" IS 'Annual salary';
            COMMENT ON COLUMN "employees"."monthly_salary" IS 'Monthly salary';
            COMMENT ON COLUMN "employees"."daily_rate" IS 'Daily rate';
            COMMENT ON COLUMN "employees"."hourly_rate" IS 'Hourly rate';
            COMMENT ON COLUMN "employees"."pay_type" IS 'Payment type';
            COMMENT ON COLUMN "employees"."phic" IS 'PHIC number';
            COMMENT ON COLUMN "employees"."hdmf" IS 'HDMF number';
            COMMENT ON COLUMN "employees"."sss_no" IS 'SSS number';
            COMMENT ON COLUMN "employees"."tin_no" IS 'TIN number';
            COMMENT ON COLUMN "employees"."tax_exempt_code" IS 'Tax exempt code';
            COMMENT ON COLUMN "employees"."is_active" IS 'Is active';
            COMMENT ON COLUMN "employees"."labor_classification" IS 'Labor classification';
            COMMENT ON COLUMN "employees"."labor_classification_status" IS 'Labor classification status';
            COMMENT ON COLUMN "employees"."remarks" IS 'Remarks';
            COMMENT ON COLUMN "employees"."last_entry_date" IS 'Last entry date';
            COMMENT ON COLUMN "employees"."retention_expiry_date" IS 'Retention expiry date';
            COMMENT ON COLUMN "employees"."deleted_by" IS 'User who deleted the employee';
            COMMENT ON COLUMN "employees"."created_by" IS 'User who created the employee';
            COMMENT ON COLUMN "employees"."updated_by" IS 'User who last updated the employee'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_93b4141fa0e89839bbdc993646" ON "employees" ("job_title_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f9d93956153b38dad389618680" ON "employees" ("employment_type_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e9c202e0e795d59cf1f5bd3d3b" ON "employees" ("employment_status_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_457a39c666de2686596e502eb8" ON "employees" ("branch_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_678a3540f843823784b0fe4a4f" ON "employees" ("department_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ac3ea8b912600710aa0813f2d5" ON "employees" ("id_number")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_2e155655b5b0c0cca0e1084c09" ON "employees" ("bio_number")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fe215f391e83381bb120d650bb" ON "employees" ("deleted_at")
        `);
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
                CONSTRAINT "PK_fd778d52915e2c9d2526d185e4f" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "barangays"."desc1" IS 'Barangay description (desc1)';
            COMMENT ON COLUMN "barangays"."deleted_by" IS 'User who deleted the barangay';
            COMMENT ON COLUMN "barangays"."created_by" IS 'User who created the barangay';
            COMMENT ON COLUMN "barangays"."updated_by" IS 'User who last updated the barangay'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a3b12f88d891cebdff04d02506" ON "barangays" ("desc1")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ebc69aae60cf125c13713ced4e" ON "barangays" ("deleted_at")
        `);
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
            CREATE TABLE "holidays" (
                "id" SERIAL NOT NULL,
                "name" character varying(255) NOT NULL,
                "date" date NOT NULL,
                "type" character varying(50) NOT NULL,
                "description" character varying(500),
                "is_recurring" boolean NOT NULL DEFAULT false,
                "deleted_by" character varying(255),
                "deleted_at" TIMESTAMP,
                "created_by" character varying(255),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying(255),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_3646bdd4c3817d954d830881dfe" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "holidays"."name" IS 'Name of the holiday';
            COMMENT ON COLUMN "holidays"."date" IS 'Date of the holiday';
            COMMENT ON COLUMN "holidays"."type" IS 'Type of holiday (e.g., National, Regional, Special)';
            COMMENT ON COLUMN "holidays"."description" IS 'Description of the holiday';
            COMMENT ON COLUMN "holidays"."is_recurring" IS 'Whether the holiday recurs annually';
            COMMENT ON COLUMN "holidays"."deleted_by" IS 'User who deleted the holiday';
            COMMENT ON COLUMN "holidays"."created_by" IS 'User who created the holiday';
            COMMENT ON COLUMN "holidays"."updated_by" IS 'User who last updated the holiday'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_edf0ee22a056c330fa5f121782" ON "holidays" ("name")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_40dfddee0c0d7125c767d8962b" ON "holidays" ("date")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_807f6c22fbc1ba875b1346328f" ON "holidays" ("type")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1b42a425aea8d35df4fc9ebfdb" ON "holidays" ("deleted_at")
        `);
        await queryRunner.query(`
            ALTER TABLE "user_permissions"
            ADD CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_permissions"
            ADD CONSTRAINT "FK_8145f5fadacd311693c15e41f10" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "role_permissions"
            ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "role_permissions"
            ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles"
            ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles"
            ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "references"
            ADD CONSTRAINT "FK_0ff32bc1409f2c78a9f90a9a9e0" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "trainings"
            ADD CONSTRAINT "FK_3ade30bf6add2afef485844bd14" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "trainings"
            ADD CONSTRAINT "FK_b8e7bf47d6a5c692f49faba9070" FOREIGN KEY ("trainings_cert_id") REFERENCES "training_certificates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "work_experiences"
            ADD CONSTRAINT "FK_e42c8f36b1dbaaa20d210efa166" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "work_experiences"
            ADD CONSTRAINT "FK_3808b5a5551cc1296d1ae61ce9c" FOREIGN KEY ("company_id") REFERENCES "work_experience_companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "work_experiences"
            ADD CONSTRAINT "FK_0a13c1782ea370c9dae9cc45636" FOREIGN KEY ("work_experience_job_title_id") REFERENCES "work_experience_jobtitles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "educations"
            ADD CONSTRAINT "FK_338d5c2c7c90b753e7c83b82557" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "educations"
            ADD CONSTRAINT "FK_8d9393b282b77f8a084ed8ffe4b" FOREIGN KEY ("education_school_id") REFERENCES "education_schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "educations"
            ADD CONSTRAINT "FK_56b14fb66ad38698b3e975ea7aa" FOREIGN KEY ("education_level_id") REFERENCES "education_levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "educations"
            ADD CONSTRAINT "FK_7435cab71e907ae2aa1e6c9def5" FOREIGN KEY ("education_course_id") REFERENCES "education_courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "educations"
            ADD CONSTRAINT "FK_997cf280b43d3b9931e28fcbd38" FOREIGN KEY ("education_course_level_id") REFERENCES "education_course_levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_93b4141fa0e89839bbdc9936467" FOREIGN KEY ("job_title_id") REFERENCES "jobtitles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_f9d93956153b38dad3896186803" FOREIGN KEY ("employment_type_id") REFERENCES "employment_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_e9c202e0e795d59cf1f5bd3d3b9" FOREIGN KEY ("employment_status_id") REFERENCES "employment_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_6c2c0d1bd40858634fa4875c7c9" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_457a39c666de2686596e502eb8c" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_678a3540f843823784b0fe4a4f2" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_f142cee8df5401ba4d4a9fcc5ca" FOREIGN KEY ("religion_id") REFERENCES "religions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_8d8b056252229fe24010a253228" FOREIGN KEY ("civil_status_id") REFERENCES "civil_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_367b763b46518a9b28bf26cc7bd" FOREIGN KEY ("citizen_ship_id") REFERENCES "citizenships"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_7ea68824a96786ce28099d6f0bf" FOREIGN KEY ("home_address_barangay_id") REFERENCES "barangays"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_e87e2ed5afb8050fc544c3ab862" FOREIGN KEY ("home_address_city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_d72582827f7887d286534420e46" FOREIGN KEY ("home_address_province_id") REFERENCES "provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_1d15c509ea08dc7d79c59f41af0" FOREIGN KEY ("present_address_barangay_id") REFERENCES "barangays"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_5d7a7cd345ec3946bcd2ec06d9c" FOREIGN KEY ("present_address_city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_55801cc442a62b3639188eb104b" FOREIGN KEY ("present_address_province_id") REFERENCES "provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "employees" DROP CONSTRAINT "FK_55801cc442a62b3639188eb104b"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_5d7a7cd345ec3946bcd2ec06d9c"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_1d15c509ea08dc7d79c59f41af0"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_d72582827f7887d286534420e46"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_e87e2ed5afb8050fc544c3ab862"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_7ea68824a96786ce28099d6f0bf"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_367b763b46518a9b28bf26cc7bd"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_8d8b056252229fe24010a253228"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_f142cee8df5401ba4d4a9fcc5ca"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_678a3540f843823784b0fe4a4f2"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_457a39c666de2686596e502eb8c"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_6c2c0d1bd40858634fa4875c7c9"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_e9c202e0e795d59cf1f5bd3d3b9"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_f9d93956153b38dad3896186803"
        `);
        await queryRunner.query(`
            ALTER TABLE "employees" DROP CONSTRAINT "FK_93b4141fa0e89839bbdc9936467"
        `);
        await queryRunner.query(`
            ALTER TABLE "educations" DROP CONSTRAINT "FK_997cf280b43d3b9931e28fcbd38"
        `);
        await queryRunner.query(`
            ALTER TABLE "educations" DROP CONSTRAINT "FK_7435cab71e907ae2aa1e6c9def5"
        `);
        await queryRunner.query(`
            ALTER TABLE "educations" DROP CONSTRAINT "FK_56b14fb66ad38698b3e975ea7aa"
        `);
        await queryRunner.query(`
            ALTER TABLE "educations" DROP CONSTRAINT "FK_8d9393b282b77f8a084ed8ffe4b"
        `);
        await queryRunner.query(`
            ALTER TABLE "educations" DROP CONSTRAINT "FK_338d5c2c7c90b753e7c83b82557"
        `);
        await queryRunner.query(`
            ALTER TABLE "work_experiences" DROP CONSTRAINT "FK_0a13c1782ea370c9dae9cc45636"
        `);
        await queryRunner.query(`
            ALTER TABLE "work_experiences" DROP CONSTRAINT "FK_3808b5a5551cc1296d1ae61ce9c"
        `);
        await queryRunner.query(`
            ALTER TABLE "work_experiences" DROP CONSTRAINT "FK_e42c8f36b1dbaaa20d210efa166"
        `);
        await queryRunner.query(`
            ALTER TABLE "trainings" DROP CONSTRAINT "FK_b8e7bf47d6a5c692f49faba9070"
        `);
        await queryRunner.query(`
            ALTER TABLE "trainings" DROP CONSTRAINT "FK_3ade30bf6add2afef485844bd14"
        `);
        await queryRunner.query(`
            ALTER TABLE "references" DROP CONSTRAINT "FK_0ff32bc1409f2c78a9f90a9a9e0"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"
        `);
        await queryRunner.query(`
            ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"
        `);
        await queryRunner.query(`
            ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_8145f5fadacd311693c15e41f10"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_1b42a425aea8d35df4fc9ebfdb"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_807f6c22fbc1ba875b1346328f"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_40dfddee0c0d7125c767d8962b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_edf0ee22a056c330fa5f121782"
        `);
        await queryRunner.query(`
            DROP TABLE "holidays"
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
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ebc69aae60cf125c13713ced4e"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a3b12f88d891cebdff04d02506"
        `);
        await queryRunner.query(`
            DROP TABLE "barangays"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_fe215f391e83381bb120d650bb"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_2e155655b5b0c0cca0e1084c09"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ac3ea8b912600710aa0813f2d5"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_678a3540f843823784b0fe4a4f"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_457a39c666de2686596e502eb8"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e9c202e0e795d59cf1f5bd3d3b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f9d93956153b38dad389618680"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_93b4141fa0e89839bbdc993646"
        `);
        await queryRunner.query(`
            DROP TABLE "employees"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."employees_labor_classification_status_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."employees_labor_classification_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."employees_pay_type_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."employees_gender_enum"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_6d59d6504ed47efe8b377f0f91"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_997cf280b43d3b9931e28fcbd3"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_7435cab71e907ae2aa1e6c9def"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_56b14fb66ad38698b3e975ea7a"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_8d9393b282b77f8a084ed8ffe4"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_338d5c2c7c90b753e7c83b8255"
        `);
        await queryRunner.query(`
            DROP TABLE "educations"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b66ac22fd8dd3429877aca5c54"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_81ede785c07e5ca628844f6391"
        `);
        await queryRunner.query(`
            DROP TABLE "education_course_levels"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_62d97b4138cd94f82b2183d793"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_0f76e660ce0e9272c5042686b2"
        `);
        await queryRunner.query(`
            DROP TABLE "education_courses"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ca36384b3322a7946e0058b0b4"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a84d4759d79c4802f9f0bb3e2c"
        `);
        await queryRunner.query(`
            DROP TABLE "education_levels"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_bec1852bb67f936454a6f73288"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_238182dc8788055aed1b232179"
        `);
        await queryRunner.query(`
            DROP TABLE "education_schools"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_d807498f89a5ec5275faee141e"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_0a13c1782ea370c9dae9cc4563"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_3808b5a5551cc1296d1ae61ce9"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e42c8f36b1dbaaa20d210efa16"
        `);
        await queryRunner.query(`
            DROP TABLE "work_experiences"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_db1e4079d62070d812e0c1ffd1"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_af59a8f41b8620756fd0aa71f9"
        `);
        await queryRunner.query(`
            DROP TABLE "work_experience_jobtitles"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_8e6ec4bc334f20c4940cc14496"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_197eb16d21291ea9a785dfd452"
        `);
        await queryRunner.query(`
            DROP TABLE "work_experience_companies"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_8c38927f20591fffb2a5fa2268"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b8e7bf47d6a5c692f49faba907"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_d35c1e210d58f9f885ec5557b8"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_3ade30bf6add2afef485844bd1"
        `);
        await queryRunner.query(`
            DROP TABLE "trainings"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ba133db940c05bc0b74d429dca"
        `);
        await queryRunner.query(`
            DROP TABLE "training_certificates"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_9eec2b9b2bd0a4d1a0403ddc6d"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_0ff32bc1409f2c78a9f90a9a9e"
        `);
        await queryRunner.query(`
            DROP TABLE "references"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_24aebd19fae2f5eb8f2270fd23"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_be632c6ce180f3ea65a7cd4b40"
        `);
        await queryRunner.query(`
            DROP TABLE "provinces"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f692aa0465e3a310358fadec5b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_23719b4c0dc7abd923b5fe2d17"
        `);
        await queryRunner.query(`
            DROP TABLE "cities"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a7483fdad50ba6886c77d67be7"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_cf101be39deef1f8cb244bc3f1"
        `);
        await queryRunner.query(`
            DROP TABLE "citizenships"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_77adeb80be4ef059d1c8c209f5"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_4d2d16110092a8c085ac02082e"
        `);
        await queryRunner.query(`
            DROP TABLE "civil_statuses"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_7e6b7a59394fb8cd80dd2c52e8"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_510a0e35e797c077644ae45812"
        `);
        await queryRunner.query(`
            DROP TABLE "religions"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ed32d8ffc094bdfd0c6dc1213e"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_290c9acd82bf9fb0d3d219444d"
        `);
        await queryRunner.query(`
            DROP TABLE "employment_statuses"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_19b2b1267c479fff79c6b87341"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_d552d43a35242a27d6083aa38a"
        `);
        await queryRunner.query(`
            DROP TABLE "employment_types"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_71a16d94fd7399d782601665ad"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_d663d489d70ad250328d45099a"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_600530eb1d9f853dd746e5819c"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e41bb9537ef5e65ee2de2cfa81"
        `);
        await queryRunner.query(`
            DROP TABLE "leave_types"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e4cf0dd7de56eafd03f3eefe6f"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f56835f98b091499412a78452b"
        `);
        await queryRunner.query(`
            DROP TABLE "jobtitles"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ea648afc7dd92d1402daac6964"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_8f232676ee7f0c19afb3b2fac9"
        `);
        await queryRunner.query(`
            DROP TABLE "departments"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_95185a2e3516c149ddf58faab5"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_2030d136f5302cedcb8f64f387"
        `);
        await queryRunner.query(`
            DROP TABLE "branches"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_073999dfec9d14522f0cf58cd6"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_23ed6f04fe43066df08379fd03"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"
        `);
        await queryRunner.query(`
            DROP TABLE "user_roles"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_7fd0c79dc4e6083ddea850ac38"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_648e3f5447f725579d7d4ffdfb"
        `);
        await queryRunner.query(`
            DROP TABLE "roles"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_25d24010f53bb80b78e412c965"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"
        `);
        await queryRunner.query(`
            DROP TABLE "role_permissions"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_1ea42cae477fc1dc619a5cd280"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_1c1e0637ecf1f6401beb9a68ab"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_89456a09b598ce8915c702c528"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_48ce552495d14eae9b187bb671"
        `);
        await queryRunner.query(`
            DROP TABLE "permissions"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a537c48b1f80e8626a71cb5658"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_8145f5fadacd311693c15e41f1"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_3495bd31f1862d02931e8e8d2e"
        `);
        await queryRunner.query(`
            DROP TABLE "user_permissions"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f0215d2793f50225f63db488fd"
        `);
        await queryRunner.query(`
            DROP TABLE "activitylog"
        `);
    }

}
