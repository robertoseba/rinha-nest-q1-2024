import { Customer } from '../entity/customer.entity';
import { Transaction } from '../entity/transaction.entity';
import { TInputTransaction, TOuputTransaction } from '../type/transaction.type';

export const TRANSACTION_REPOSITORY = Symbol('ITransactionRepository');

export interface ITransactionRepository {
  createTransaction(
    id: number,
    transaction: TInputTransaction,
  ): TOuputTransaction;

  getLastTransactionsBy(customer: Customer): Promise<Transaction[]>;
}
