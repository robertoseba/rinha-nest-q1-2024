import { EntityManager } from 'typeorm';
import { Account } from '../entity/account.entity';

export const ACCOUNT_REPOSITORY = Symbol('IAccountRepository');

export interface IAccountRepository {
  getById(id: number): Promise<Account>;

  updateBalance(
    accountId: number,
    amount: number,
    manager?: null | EntityManager,
  ): Promise<Account>;
}
