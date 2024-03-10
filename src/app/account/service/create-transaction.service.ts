import { Inject, Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { DatabaseService } from '../../../infra/db/database.service';
import { NotFoundCache } from '../decorator/not-found-cache.decorator';
import { Account } from '../entity/account.entity';
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

@Injectable()
export class CreateTransactionService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,

    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,

    private readonly databaseService: DatabaseService,
  ) {}

  @NotFoundCache()
  async execute(
    accountId: number,
    inputDTO: TInputTransaction,
  ): Promise<Account> {
    const account = await this.databaseService.startTransaction(
      async (queryRunner: QueryRunner) => {
        const value =
          inputDTO.tipo === TransactionTypeEnum.CREDIT
            ? inputDTO.valor
            : -inputDTO.valor;

        const account = await this.accountRepository.updateBalance(
          accountId,
          value,
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

        return account;
      },
    );

    return account;
  }
}
