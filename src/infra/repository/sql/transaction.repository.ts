import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Transaction } from '../../../app/account/entity/transaction.entity';
import { ITransactionRepository } from '../../../app/account/repository/transaction.respository';

@Injectable()
export class TransactionRepositorySql implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
  ) {}

  async getLastTransactionsBy(accountId: number): Promise<Transaction[]> {
    return await this.repo
      .createQueryBuilder()
      .where({ account: { id: accountId } })
      .take(10)
      .orderBy({ created_at: 'DESC' })
      .getMany();
  }

  async saveTransaction(
    transactionData: Partial<Transaction>,
    manager?: null | EntityManager,
  ): Promise<Transaction> {
    const repo = manager?.getRepository(Transaction) ?? this.repo;

    return await repo.save(transactionData);
  }
}
