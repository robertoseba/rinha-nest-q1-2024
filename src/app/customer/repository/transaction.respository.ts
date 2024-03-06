import { Transaction } from '../entity/transaction.entity';
import { TInputTransaction, TOuputTransaction } from '../type/transaction.type';

export const TRANSACTION_REPOSITORY = Symbol('ITransactionRepository');

export interface ITransactionRepository {
  getLastTransactionsBy(customerId: number): Promise<Transaction[]>;
}
