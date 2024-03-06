import { MigrationInterface, QueryRunner } from 'typeorm';
import { Customer } from '../../../app/customer/entity/customer.entity';

export class Seeder1709580210512 implements MigrationInterface {
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

    await queryRunner.query(`INSERT INTO balances (customer_id, balance)
      SELECT id, 0 FROM customers;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM balances`);
    await queryRunner.query(`DELETE FROM customers`);
  }
}
