import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  Relation,
} from 'typeorm';
import { Customer } from './customer.entity';

export enum TransactionTypeEnum {
  CREDIT = 'c',
  DEBIT = 'd',
}

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.transactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<Customer>;

  @Column({ type: 'integer', nullable: false })
  value: number;

  @Column({ type: 'enum', enum: TransactionTypeEnum, nullable: false })
  type: TransactionTypeEnum;

  @Column({ type: 'varchar', length: 10, nullable: false })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
