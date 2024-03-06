import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TStatement } from './type/statement.type';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from './repository/customer.repository';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from './repository/transaction.respository';
import {
  TInputTransaction,
  TOuputTransaction,
  TTransaction,
} from './type/transaction.type';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async getStatement(id: number): Promise<TStatement | null> {
    const customer = await this.customerRepository.getStatement(id);
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado!');
    }

    const lastTransactions =
      await this.transactionRepository.getLastTransactionsBy(customer);

    const returnTransactions: TTransaction[] = lastTransactions.map(
      (transaction) => {
        return {
          valor: transaction.value,
          tipo: transaction.type,
          descricao: transaction.description,
          realizada_em: transaction.createdAt,
        };
      },
    );
    return {
      saldo: {
        total: customer.balance.balance,
        limite: customer.limit,
        data_extrato: new Date(),
      },
      ultimas_transacoes: returnTransactions,
    };
  }

  createTransaction(
    customerId: number,
    transaction: TInputTransaction,
  ): TOuputTransaction {
    return this.transactionRepository.createTransaction(
      customerId,
      transaction,
    );
  }
}
