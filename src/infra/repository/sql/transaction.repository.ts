import { Repository } from 'typeorm';
import {
  TInputTransaction,
  TOuputTransaction,
} from '../../../app/customer/type/transaction.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../../app/customer/entity/transaction.entity';
import { ITransactionRepository } from '../../../app/customer/repository/transaction.respository';
import { Customer } from '../../../app/customer/entity/customer.entity';

@Injectable()
export class TransactionRepositorySql
  extends Repository<Transaction>
  implements ITransactionRepository
{
  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async getLastTransactionsBy(customerId: number): Promise<Transaction[]> {
    return await this.createQueryBuilder()
      .where({ customer: { id: customerId } })
      .take(10)
      .orderBy({ created_at: 'DESC' })
      .getMany();
  }
}
