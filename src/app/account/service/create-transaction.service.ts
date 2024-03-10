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
import { ACCOUNT_CONSTRAINT, Account } from '../entity/account.entity';
import { TransactionTypeEnum } from '../entity/transaction.entity';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from '../repository/account.repository';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../repository/transaction.respository';
import { TInputTransaction } from '../type/transaction.type';
import { NotFoundCache } from './not-found-cache.decorator';

@Injectable()
export class CreateTransactionService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    // infra
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @NotFoundCache()
  async execute(
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

      const account = await this.accountRepository.updateBalance(
        accountId,
        inputDTO.tipo === TransactionTypeEnum.CREDIT
          ? inputDTO.valor
          : -inputDTO.valor,
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

      await this.cacheManager.del(`${accountId}_statement`);

      return account;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err?.constraint == ACCOUNT_CONSTRAINT) {
        throw new UnprocessableEntityException('Saldo estourou limite!');
      }

      if (err instanceof NotFoundException) {
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
