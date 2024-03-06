import { MigrationInterface, QueryRunner } from 'typeorm';
import { Customer } from '../../../app/customer/entity/customer.entity';

export class Seed1709756096781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queryBuilder = queryRunner.manager.createQueryBuilder();

    await queryBuilder
      .insert()
      .into(Customer)
      .values([
        { name: 'customer 2', limit: 800 * 100 },
        { name: 'customer 3', limit: 10000 * 100 },
        { name: 'customer 4', limit: 100000 * 100 },
        { name: 'customer 5', limit: 5000 * 100 },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM customers`);
  }
}
