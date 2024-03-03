import { Injectable } from '@nestjs/common';
import { TStatement } from './type/statement.type';
import {
  TInputTransaction,
  TTransaction,
  TTransactionReturn,
} from './type/transaction.type';
import { error } from 'console';

@Injectable()
export class CustomerService {
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
  ): TTransactionReturn {
    new error('Not implemented');
  }
}
