import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730173923133 implements MigrationInterface {
    name = 'Migration1730173923133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auths" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_22fc0631a651972ddc9c5a31090" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("roleId" SERIAL NOT NULL, "roleName" character varying(255) NOT NULL, CONSTRAINT "PK_39bf7e8af8fe54d9d1c7a8efe6f" PRIMARY KEY ("roleId"))`);
        await queryRunner.query(`ALTER TABLE "auths" ADD CONSTRAINT "FK_22919396e73ff341e085ea2538c" FOREIGN KEY ("roleId") REFERENCES "roles"("roleId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auths" DROP CONSTRAINT "FK_22919396e73ff341e085ea2538c"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "auths"`);
    }

}
