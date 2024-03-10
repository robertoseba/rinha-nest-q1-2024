import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DataSource } from 'typeorm';
import { ACCOUNT_CONSTRAINT, Account } from './entity/account.entity';
import { TransactionTypeEnum } from './entity/transaction.entity';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from './repository/account.repository';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from './repository/transaction.respository';
import { TStatement } from './type/statement.type';
import { TInputTransaction, TTransaction } from './type/transaction.type';

@Injectable()
export class AccountService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getStatement(accountId: number): Promise<TStatement> {
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
        total: account.balance,
        data_extrato: new Date(),
        limite: account.limit,
      },
      ultimas_transacoes: returnTransactions,
    };
  }

  async createTransaction(
    accountId: number,
    inputDTO: TInputTransaction,
  ): Promise<Account> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      const is404 = await this.cacheManager.get(`${accountId}`);
      if (is404) {
        throw new NotFoundException('Cliente não encontrado!');
      }

      await queryRunner.connect();

      await queryRunner.startTransaction();

      if (inputDTO.tipo === TransactionTypeEnum.DEBIT) {
        inputDTO.valor = inputDTO.valor * -1;
      }

      const account = await this.accountRepository.updateBalance(
        accountId,
        inputDTO.valor,
        queryRunner.manager,
      );

      await this.transactionRepository.saveTransaction(
        {
          description: inputDTO.descricao,
          value: inputDTO.valor,
          type: inputDTO.tipo,
          account: account,
        },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
      return account;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err?.constraint == ACCOUNT_CONSTRAINT) {
        throw new UnprocessableEntityException('Saldo estourou limite!');
      }

      if (err instanceof NotFoundException) {
        await this.cacheManager.set(`${accountId}`, 0, 0);
        throw err;
      }

      throw new HttpException(
        'Não foi possível realizar operação.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
