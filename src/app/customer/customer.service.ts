import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TStatement } from './type/statement.type';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from './repository/customer.repository';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from './repository/transaction.respository';
import { TInputTransaction, TTransaction } from './type/transaction.type';
import { DataSource } from 'typeorm';
import { TransactionTypeEnum } from './entity/transaction.entity';
import { BALANCE_CONSTRAINT, Customer } from './entity/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getStatement(customerId: number): Promise<TStatement> {
    const customer = await this.customerRepository.getById(customerId);
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado!');
    }

    const lastTransactions =
      await this.transactionRepository.getLastTransactionsBy(customerId);

    const returnTransactions: TTransaction[] = lastTransactions.map(
      (transaction) => {
        return {
          valor: transaction.value,
          tipo: transaction.type,
          descricao: transaction.description,
          realizada_em: transaction.createdAt,
        };
      },
    );

    return {
      saldo: {
        total: customer.balance,
        data_extrato: new Date(),
        limite: customer.limit,
      },
      ultimas_transacoes: returnTransactions,
    };
  }

  async createTransaction(
    customerId: number,
    inputDTO: TInputTransaction,
  ): Promise<Customer> {
    const queryRunner = this.dataSource.createQueryRunner();
    let customer = null;
    try {
      await queryRunner.startTransaction();

      if (inputDTO.tipo === TransactionTypeEnum.CREDIT) {
        customer = await this.customerRepository.increaseBalance(
          customerId,
          inputDTO.valor,
          queryRunner.manager,
        );
      } else {
        customer = await this.customerRepository.decreaseBalance(
          customerId,
          inputDTO.valor,
          queryRunner.manager,
        );
      }

      await this.transactionRepository.saveTransaction(
        {
          description: inputDTO.descricao,
          value: inputDTO.valor,
          type: inputDTO.tipo,
          customer: customer,
        },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err?.constraint == BALANCE_CONSTRAINT) {
        throw new UnprocessableEntityException('Saldo estourou limite!');
      }

      if (err instanceof NotFoundException) {
        throw err;
      }

      console.error(err);
      throw new HttpException(
        'Não foi possível realizar operação.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }

    return customer;
  }
}
