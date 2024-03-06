import { Customer } from '../entity/customer.entity';
import { TInputTransaction, TOuputTransaction } from '../type/transaction.type';

export const CUSTOMER_REPOSITORY = Symbol('ICustomerRepository');

export interface ICustomerRepository {
  getStatement(id: number): Promise<Customer | null>;

  createTransaction(
    id: number,
    transaction: TInputTransaction,
  ): Promise<TOuputTransaction>;
}
