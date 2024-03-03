import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
  OneToOne,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Balance } from './balance.entity';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'integer', default: 0, nullable: false })
  limit: number;

  @OneToMany(() => Transaction, (transaction) => transaction.customer)
  transactions: Relation<Transaction>[];

  @OneToOne(() => Balance, (balance) => balance.balance)
  balance: Relation<Balance>;
}
