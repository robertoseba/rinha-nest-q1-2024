import { MigrationInterface, QueryRunner } from 'typeorm';
import { Customer } from '../../../app/customer/entity/customer.entity';

export class Seed1709756096781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queryBuilder = queryRunner.manager.createQueryBuilder();

    await queryBuilder
      .insert()
      .into(Customer)
      .values([
        { name: 'customer 1', limit: 100000 },
        { name: 'customer 2', limit: 80000 },
        { name: 'customer 3', limit: 1000000 },
        { name: 'customer 4', limit: 10000000 },
        { name: 'customer 5', limit: 500000 },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM customers`);
  }
}
