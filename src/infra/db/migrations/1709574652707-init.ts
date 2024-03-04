import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1709574652707 implements MigrationInterface {
    name = 'Init1709574652707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "balances" ("id" SERIAL NOT NULL, "balance" integer NOT NULL, "customer_id" integer NOT NULL, CONSTRAINT "REL_a4134356ce0cba9771f500144c" UNIQUE ("customer_id"), CONSTRAINT "PK_74904758e813e401abc3d4261c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "limit" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('c', 'd')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "description" character varying(10) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "customer_id" integer NOT NULL, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "balances" ADD CONSTRAINT "FK_a4134356ce0cba9771f500144ca" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6f09843c214f21a462b54b11e8d" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6f09843c214f21a462b54b11e8d"`);
        await queryRunner.query(`ALTER TABLE "balances" DROP CONSTRAINT "FK_a4134356ce0cba9771f500144ca"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "balances"`);
    }

}
