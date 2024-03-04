import { Repository } from 'typeorm';
import {
  TInputTransaction,
  TOuputTransaction,
} from '../../../app/customer/type/transaction.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../../app/customer/entity/transaction.entity';
import { ITransactionRepository } from '../../../app/customer/repository/transaction.respository';

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
  createTransaction(
    id: number,
    transaction: TInputTransaction,
  ): TOuputTransaction {
    throw new Error('Method not implemented.');
  }
}
