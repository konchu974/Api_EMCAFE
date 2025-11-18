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

  @Column({ type: 'char', length: 36 })
  id_order!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 50 })
  payment_method!: string;     // e.g. "PAYPAL"

  @Column({ type: 'varchar', length: 50 })
  payment_status!: string;     // e.g. "COMPLETED"

  @Column({ type: 'varchar', length: 255, nullable: true })
  transaction_id!: string | null; // e.g. PayPal capture ID

  @Column({ type: 'timestamp', nullable: true })
  paid_at!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_order' })
  order!: Order;
}
