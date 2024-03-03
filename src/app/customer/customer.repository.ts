import { TStatement } from './type/statement.type';
import { TInputTransaction, TOuputTransaction } from './type/transaction.type';

export const CUSTOMER_REPOSITORY = Symbol('ICustomerRepository');

export interface ICustomerRepository {
  getStatement(id: number): TStatement;

  makeTransaction(
    id: number,
    transaction: TInputTransaction,
  ): TOuputTransaction;
}
