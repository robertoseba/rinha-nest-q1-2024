import { MigrationInterface, QueryRunner } from "typeorm";

export class CheckConstraint1709760634092 implements MigrationInterface {
    name = 'CheckConstraint1709760634092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "CHK_a2a818348bf85baeeb8c9e980e"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "balance_over_limit_constraint" CHECK ("balance" >= "limit" * -1 )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "balance_over_limit_constraint"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "CHK_a2a818348bf85baeeb8c9e980e" CHECK ((balance >= ("limit" * '-1'::integer)))`);
    }

}
