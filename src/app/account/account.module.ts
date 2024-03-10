import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRepositorySql } from '../../infra/repository/sql/account.repository';
import { TransactionRepositorySql } from '../../infra/repository/sql/transaction.repository';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './entity/account.entity';
import { Transaction } from './entity/transaction.entity';
import { ACCOUNT_REPOSITORY } from './repository/account.repository';
import { TRANSACTION_REPOSITORY } from './repository/transaction.respository';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction])],
  controllers: [AccountController, TransactionController],
  providers: [
    AccountService,
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
