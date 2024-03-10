import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRepositorySql } from '../../infra/repository/sql/account.repository';
import { TransactionRepositorySql } from '../../infra/repository/sql/transaction.repository';
import { AccountController } from './account.controller';
import { Account } from './entity/account.entity';
import { Transaction } from './entity/transaction.entity';
import { ACCOUNT_REPOSITORY } from './repository/account.repository';
import { TRANSACTION_REPOSITORY } from './repository/transaction.respository';
import { CreateTransactionService } from './service/create-transaction.service';
import { getStatementService } from './service/get-statement.service';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction])],
  controllers: [AccountController, TransactionController],
  providers: [
    getStatementService,
    CreateTransactionService,
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: AccountRepositorySql,
    },
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepositorySql,
    },
  ],
})
export class AccountModule {}
