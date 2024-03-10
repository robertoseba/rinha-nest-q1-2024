import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Transaction } from '../entity/transaction.entity';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from '../repository/account.repository';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../repository/transaction.respository';
import { TStatement } from '../type/statement.type';
import { TTransaction } from '../type/transaction.type';

@Injectable()
export class getStatementService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(accountId: number): Promise<TStatement> {
    const is404 = await this.cacheManager.get(`${accountId}`);
    if (is404) {
      throw new NotFoundException('Cliente não encontrado!');
    }

    const promiseAccount = this.accountRepository.getById(accountId);

    const promiseTransaction =
      this.transactionRepository.getLastTransactionsBy(accountId);

    const [account, lastTransactions] = await Promise.all([
      promiseAccount,
      promiseTransaction,
    ]);

    if (!account) {
      await this.cacheManager.set(`accountId`, 1, 0);
      throw new NotFoundException('Cliente não encontrado!');
    }

    return {
      saldo: {
        total: account.balance,
        data_extrato: new Date(),
        limite: account.limit,
      },
      ultimas_transacoes: this.mapTransactions(lastTransactions),
    };
  }

  private mapTransactions(transactions: Transaction[]): TTransaction[] {
    return transactions.map((transaction) => {
      return {
        valor: transaction.value,
        tipo: transaction.type,
        descricao: transaction.description,
        realizada_em: transaction.createdAt,
      };
    });
  }
}
