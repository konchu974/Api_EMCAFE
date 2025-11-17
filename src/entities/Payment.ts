import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Order } from './Order';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id_payment!: string;

  @CreateDateColumn()
  payment_date!: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @Column({ length: 50, default: 'PENDING' })
  status!: string;

  @Column({ type: 'char', length: 36, unique: true })
  id_order!: string;

  @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_order' })
  order!: Order;
}
