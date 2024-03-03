import { TInputTransaction, TOuputTransaction } from '../type/transaction.type';

export const TRANSACTION_REPOSITORY = Symbol('ITransactionRepository');

export interface ITransactionRepository {
  create(id: number, transaction: TInputTransaction): TOuputTransaction;
}
