import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Transaction } from './transaction.entity';

export const ACCOUNT_CONSTRAINT = 'balance_over_limit_constraint';

@Entity({ name: 'accounts' })
@Check(ACCOUNT_CONSTRAINT, '"balance" >= "limit" * -1 ')
export class Account {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'integer', default: 0, nullable: false })
  limit: number;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Relation<Transaction>[];

  @Column({ type: 'integer', nullable: false, default: 0 })
  balance: number;
}
