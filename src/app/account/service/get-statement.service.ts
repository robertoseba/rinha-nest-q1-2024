import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { NotFoundCache } from '../decorator/not-found-cache.decorator';
import { StatementCache } from '../decorator/statement-cache.decorator';
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
export class GetStatementService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  @NotFoundCache()
  @StatementCache()
  async execute(accountId: number): Promise<TStatement> {
    const promiseAccount = this.accountRepository.getById(accountId);

    const promiseTransaction =
      this.transactionRepository.getLastTransactionsBy(accountId);

    const [account, lastTransactions] = await Promise.all([
      promiseAccount,
      promiseTransaction,
    ]);

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
