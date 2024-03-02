import { TStatement } from './type/statement.type';
import { TInputTransaction, TTransactionReturn } from './type/transaction.type';

export interface ICustomerRepository {
  getStatement(id: number): TStatement;

  makeTransaction(
    id: number,
    transaction: TInputTransaction,
  ): TTransactionReturn;
}
