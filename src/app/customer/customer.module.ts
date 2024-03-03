import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';
import { CustomerRepositorySql } from '../../infra/repository/sql/customer.repository';
import { CUSTOMER_REPOSITORY } from './repository/customer.repository';
import { TRANSACTION_REPOSITORY } from './repository/transaction.respository';
import { TransactionRepositorySql } from '../../infra/repository/sql/transaction.repository';
import { Transaction } from './entity/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Transaction])],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepositorySql,
    },
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepositorySql,
    },
  ],
})
export class CustomerModule {}
