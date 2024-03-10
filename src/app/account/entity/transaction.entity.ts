import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Account } from './account.entity';

export enum TransactionTypeEnum {
  CREDIT = 'c',
  DEBIT = 'd',
}

@Entity({ name: 'transactions' })
@Index('created_at_index', ['account', 'createdAt'])
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Account, (account) => account.transactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'account_id' })
  account: Relation<Account>;

  @Column({ type: 'integer', nullable: false })
  value: number;

  @Column({ type: 'enum', enum: TransactionTypeEnum, nullable: false })
  type: TransactionTypeEnum;

  @Column({ type: 'varchar', length: 10, nullable: false })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
