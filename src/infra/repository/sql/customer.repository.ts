import { ICustomerRepository } from '../../../app/customer/customer.repository';
import { TStatement } from '../../../app/customer/type/statement.type';
import { TTransactionReturn } from '../../../app/customer/type/transaction.type';

export class CustomerRepositorySql implements ICustomerRepository {
  makeTransaction(
    id: number,
    transaction: { valor: number; tipo: 'c' | 'd'; descricao: string },
  ): TTransactionReturn {
    throw new Error('Method not implemented.');
  }
  getStatement(id: number): TStatement {
    throw new Error('Method not implemented.');
  }
}
