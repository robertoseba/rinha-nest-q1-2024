import { Repository } from 'typeorm';
import { ICustomerRepository } from '../../../app/customer/customer.repository';
import { TStatement } from '../../../app/customer/type/statement.type';
import { TTransactionReturn } from '../../../app/customer/type/transaction.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../../../app/customer/entity/customer.entity';

@Injectable()
export class CustomerRepositorySql
  extends Repository<Customer>
  implements ICustomerRepository
{
  constructor(@InjectRepository(Customer) private repo: Repository<Customer>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  makeTransaction(
    id: number,
    transaction: { valor: number; tipo: 'c' | 'd'; descricao: string },
  ): TTransactionReturn {
    throw new Error('Method not implemented.');
  }
  getStatement(id: number): TStatement {
    throw new Error('Method not implemented.');
  }
}
