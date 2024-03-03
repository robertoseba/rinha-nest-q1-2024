import { Inject, Injectable } from '@nestjs/common';
import { TStatement } from './type/statement.type';
import { TTransaction } from './type/transaction.type';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from './repository/customer.repository';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from './repository/transaction.respository';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  getStatement(id: number): TStatement {
    return this.customerRepository.getStatement(id);
  }

  createTransaction(
    customerId: number,
    transaction: TInputTransaction,
  ): TOuputTransaction {
    return this.transactionRepository.create(customerId, transaction);
  }
}
