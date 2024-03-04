import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity({ name: 'balances' })
export class Balance {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => Customer, { nullable: false })
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<Customer>;

  @Column({ type: 'integer', nullable: false })
  balance: number;
}
