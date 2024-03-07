import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../../app/customer/entity/transaction.entity';
import { ITransactionRepository } from '../../../app/customer/repository/transaction.respository';

@Injectable()
export class TransactionRepositorySql implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
  ) {}

  async getLastTransactionsBy(customerId: number): Promise<Transaction[]> {
    return await this.repo
      .createQueryBuilder()
      .where({ customer: { id: customerId } })
      .take(10)
      .orderBy({ created_at: 'DESC' })
      .getMany();
  }

  async saveTransaction(
    transactionData: Partial<Transaction>,
  ): Promise<Transaction> {
    return await this.repo.save(transactionData);
  }
}
