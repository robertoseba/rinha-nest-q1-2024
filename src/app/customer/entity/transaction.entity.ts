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

export enum TransactionType {
  CREDIT = 'c',
  DEBIT = 'd',
}

@Entity()
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

  @Column({ type: 'enum', enum: TransactionType, nullable: false })
  type: TransactionType;

  @Column({ type: 'varchar', length: 10, nullable: false })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
