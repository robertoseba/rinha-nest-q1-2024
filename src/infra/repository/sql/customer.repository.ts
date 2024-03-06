import { Repository } from 'typeorm';
import { ICustomerRepository } from '../../../app/customer/repository/customer.repository';
import { TStatement } from '../../../app/customer/type/statement.type';
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

  async getStatement(id: number): Promise<TStatement> {
    // const customer = await this.get(id);
    throw new Error('not implemented');
  }
}
