import { Inject, Injectable } from '@nestjs/common';
import { TStatement } from './type/statement.type';
import { TTransaction } from './type/transaction.type';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: ICustomerRepository,
  ) {}

  getStatement(id: number): TStatement {
    const transaction: TTransaction = {
      valor: 1000,
      tipo: 'c',
      descricao: 'credito inicial',
      realizada_em: new Date(),
    };

    const statement: TStatement = {
      saldo: {
        total: 0,
        data_extrato: new Date(),
        limite: 0,
      },
      ultimas_transacoes: [transaction],
    };

    return statement;
  }

  makeTransaction(
    customerId: string,
    transaction: TInputTransaction,
  ): TOuputTransaction {
    throw new Error('Not implemented');
  }
}
