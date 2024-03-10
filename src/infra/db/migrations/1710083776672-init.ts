import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1710083776672 implements MigrationInterface {
    name = 'Init1710083776672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "limit" integer NOT NULL DEFAULT '0', "balance" integer NOT NULL DEFAULT '0', CONSTRAINT "balance_over_limit_constraint" CHECK ("balance" >= "limit" * -1 ), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('c', 'd')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "description" character varying(10) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "account_id" integer NOT NULL, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "created_at_index" ON "transactions" ("account_id", "created_at") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0"`);
        await queryRunner.query(`DROP INDEX "public"."created_at_index"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
    }

}
