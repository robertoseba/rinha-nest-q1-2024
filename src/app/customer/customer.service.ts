import { Inject, Injectable } from '@nestjs/common';
import { TStatement } from './type/statement.type';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from './repository/customer.repository';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from './repository/transaction.respository';
import { TInputTransaction, TOuputTransaction } from './type/transaction.type';

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
    return this.transactionRepository.createTransaction(
      customerId,
      transaction,
    );
  }
}
