import { Repository } from 'typeorm';
import { ICustomerRepository } from '../../../app/customer/repository/customer.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../../../app/customer/entity/customer.entity';

@Injectable()
export class CustomerRepositorySql implements ICustomerRepository {
  constructor(@InjectRepository(Customer) private repo: Repository<Customer>) {}

  async getById(id: number): Promise<Customer | null> {
    return await this.repo.findOne({
      where: { id: id },
    });
  }

  async increaseBalance(customerId: number, amount: number): Promise<Customer> {
    await this.repo
      .createQueryBuilder()
      .setLock('pessimistic_read')
      .where('id = :id', { id: customerId })
      .execute();

    const customer: Customer | undefined = (
      await this.repo.query(
        `UPDATE customers SET balance = balance + $1 WHERE customers.id = $2 RETURNING *`,
        [amount, customerId],
      )
    )[0][0];

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado!');
    }

    return customer;
  }

  async decreaseBalance(customerId: number, amount: number): Promise<Customer> {
    await this.repo
      .createQueryBuilder()
      .setLock('pessimistic_read')
      .where('id = :id', { id: customerId })
      .execute();

    const customer: Customer | undefined = (
      await this.repo.query(
        `UPDATE customers SET balance = balance - $1 WHERE customers.id = $2 RETURNING *`,
        [amount, customerId],
      )
    )[0][0];

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado!');
    }

    return customer;
  }
}
