import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { Transaction } from './transaction.entity';

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
}
