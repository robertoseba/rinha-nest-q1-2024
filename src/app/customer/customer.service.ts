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
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getStatement(customerId: number): Promise<TStatement> {
    const is404 = await this.cacheManager.get(`${customerId}`);
    if (is404) {
      throw new NotFoundException('Cliente não encontrado!');
    }

    const customerP = this.customerRepository.getById(customerId);

    const lastTransactionsP =
      this.transactionRepository.getLastTransactionsBy(customerId);

    const [customer, lastTransactions] = await Promise.all([
      customerP,
      lastTransactionsP,
    ]);

    if (!customer) {
      await this.cacheManager.set(`customerId`, 1, 0);
      throw new NotFoundException('Cliente não encontrado!');
    }

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

    try {
      const is404 = await this.cacheManager.get(`${customerId}`);
      if (is404) {
        throw new NotFoundException('Cliente não encontrado!');
      }

      await queryRunner.connect();

      await queryRunner.startTransaction();

      let customer = null;

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
      return customer;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err?.constraint == BALANCE_CONSTRAINT) {
        throw new UnprocessableEntityException('Saldo estourou limite!');
      }

      if (err instanceof NotFoundException) {
        await this.cacheManager.set(`${customerId}`, 0, 0);
        throw err;
      }

      throw new HttpException(
        'Não foi possível realizar operação.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
