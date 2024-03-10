import { EntityManager } from 'typeorm';
import { Transaction } from '../entity/transaction.entity';

export const TRANSACTION_REPOSITORY = Symbol('ITransactionRepository');

export interface ITransactionRepository {
  getLastTransactionsBy(accountId: number): Promise<Transaction[]>;

  saveTransaction(
    transactionData: Partial<Transaction>,
    manager?: null | EntityManager,
  ): Promise<Transaction>;
}
