import { MigrationInterface, QueryRunner } from 'typeorm';

export class Indexes1709814172464 implements MigrationInterface {
  name = 'Indexes1709814172464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "created_at_index" ON "transactions" ("customer_id", "created_at"  DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."created_at_index"`);
  }
}
