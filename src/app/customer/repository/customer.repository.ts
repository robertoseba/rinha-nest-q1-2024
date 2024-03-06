import { Customer } from '../entity/customer.entity';

export const CUSTOMER_REPOSITORY = Symbol('ICustomerRepository');

export interface ICustomerRepository {
  getStatement(id: number): Promise<Customer | null>;
}
