import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  ACCOUNT_CONSTRAINT,
  Account,
} from '../../../app/account/entity/account.entity';
import { IAccountRepository } from '../../../app/account/repository/account.repository';

@Injectable()
export class AccountRepositorySql implements IAccountRepository {
  constructor(@InjectRepository(Account) private repo: Repository<Account>) {}

  async getById(id: number): Promise<Account> {
    const account = await this.repo.findOne({
      where: { id: id },
    });

    if (!account) {
      throw new NotFoundException('Cliente não encontrado!');
    }
    return account;
  }

  async updateBalance(
    accountId: number,
    amount: number,
    manager?: null | EntityManager,
  ): Promise<Account> {
    const repo = manager?.getRepository(Account) ?? this.repo;

    try {
      await repo.query(`SELECT pg_advisory_xact_lock($1);`, [accountId]);

      const account: Account | undefined = (
        await repo.query(
          `UPDATE accounts SET balance = balance + $1 WHERE accounts.id = $2 RETURNING *`,
          [amount, accountId],
        )
      )[0][0];

      if (!account) {
        throw new NotFoundException('Cliente não encontrado!');
      }

      return account;
    } catch (err) {
      if (err?.constraint == ACCOUNT_CONSTRAINT) {
        throw new UnprocessableEntityException('Saldo estourou limite!');
      }
      throw err;
    }
  }
}
