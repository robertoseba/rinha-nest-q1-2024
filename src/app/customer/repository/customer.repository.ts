import { EntityManager } from 'typeorm';
import { Customer } from '../entity/customer.entity';

export const CUSTOMER_REPOSITORY = Symbol('ICustomerRepository');

export interface ICustomerRepository {
  getById(id: number): Promise<Customer | null>;

  increaseBalance(
    customerId: number,
    amount: number,
    manager?: null | EntityManager,
  ): Promise<Customer>;

  decreaseBalance(
    customerId: number,
    amount: number,
    manager?: null | EntityManager,
  ): Promise<Customer>;
}
