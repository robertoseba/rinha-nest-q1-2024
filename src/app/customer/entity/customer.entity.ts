import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
  Check,
} from 'typeorm';
import { Transaction } from './transaction.entity';

export const BALANCE_CONSTRAINT = 'balance_over_limit_constraint';
@Entity({ name: 'customers' })
@Check(BALANCE_CONSTRAINT, '"balance" >= "limit" * -1 ')
export class Customer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'integer', default: 0, nullable: false })
  limit: number;

  @OneToMany(() => Transaction, (transaction) => transaction.customer)
  transactions: Relation<Transaction>[];

  @Column({ type: 'integer', nullable: false, default: 0 })
  balance: number;
}
