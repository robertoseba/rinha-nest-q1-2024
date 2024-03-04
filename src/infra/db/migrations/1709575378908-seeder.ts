import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seeder1709575378908 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO clientes (name, limit)
	VALUES
		('o barato sai caro', 1000 * 100),
		('zan corp ltda', 800 * 100),
		('les cruders', 10000 * 100),
		('padaria joia de cocaia', 100000 * 100),
		('kid mais', 5000 * 100);';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
