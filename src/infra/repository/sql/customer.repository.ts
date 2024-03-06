import { Repository } from 'typeorm';
import { ICustomerRepository } from '../../../app/customer/repository/customer.repository';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BALANCE_CONSTRAINT,
  Customer,
} from '../../../app/customer/entity/customer.entity';
import {
  TInputTransaction,
  TOuputTransaction,
} from '../../../app/customer/type/transaction.type';
import { TransactionTypeEnum } from '../../../app/customer/entity/transaction.entity';

@Injectable()
export class CustomerRepositorySql
  extends Repository<Customer>
  implements ICustomerRepository
{
  private logger = new Logger(CustomerRepositorySql.name);

  constructor(@InjectRepository(Customer) private repo: Repository<Customer>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async getStatement(id: number): Promise<Customer | null> {
    return await this.findOne({
      where: { id: id },
    });
  }

  async createTransaction(
    id: number,
    transaction: TInputTransaction,
  ): Promise<TOuputTransaction> {
    const queryRunner = this.queryRunner;

    try {
      await queryRunner?.startTransaction('REPEATABLE READ');
      await this.createQueryBuilder()
        .setLock('pessimistic_read')
        .where('id = :id', { id: id })
        .execute();

      const queryStrategy = {
        [TransactionTypeEnum.CREDIT]: `UPDATE customers SET balance = balance + $1 WHERE customers.id = $2 RETURNING *`,
        [TransactionTypeEnum.DEBIT]: `UPDATE customers SET balance = balance - $1 WHERE customers.id = $2 RETURNING *`,
      };

      const customer: Customer | null = (
        await this.query(queryStrategy[transaction.tipo], [
          transaction.valor,
          id,
        ])
      )[0][0];

      if (!customer) {
        throw new NotFoundException('Cliente não encontrado!');
      }

      await this.query(
        `INSERT INTO transactions (type,value,description,customer_id) VALUES ($1,$2,$3,$4)`,
        [transaction.tipo, transaction.valor, transaction.descricao, id],
      );

      await queryRunner?.commitTransaction();

      return { limite: customer.limit, saldo: customer.balance };
    } catch (err) {
      await queryRunner?.rollbackTransaction();

      if (err?.constraint == BALANCE_CONSTRAINT) {
        throw new UnprocessableEntityException('Saldo estourou limite!');
      }

      this.logger.error(err);

      throw new Error('Não foi possível realizar operação.');
    }
  }
}
