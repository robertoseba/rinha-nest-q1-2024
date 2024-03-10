import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../infra/db/database.module';
import { AccountRepositorySql } from '../../infra/repository/sql/account.repository';
import { TransactionRepositorySql } from '../../infra/repository/sql/transaction.repository';
import { AccountController } from './account.controller';
import { Account } from './entity/account.entity';
import { Transaction } from './entity/transaction.entity';
import { ACCOUNT_REPOSITORY } from './repository/account.repository';
import { TRANSACTION_REPOSITORY } from './repository/transaction.respository';
import { CreateTransactionService } from './service/create-transaction.service';
import { GetStatementService } from './service/get-statement.service';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction]), DatabaseModule],
  controllers: [AccountController, TransactionController],
  providers: [
    GetStatementService,
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
