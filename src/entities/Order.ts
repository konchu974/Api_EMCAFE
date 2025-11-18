import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserAccount } from './UserAccount';
import { OrderItem } from './OrderItem';
import { Payment } from './Payment';

@Entity('order')
export class Order {

  @PrimaryGeneratedColumn('uuid')
  id_order!: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;

  @Column({ length: 50, default: 'PENDING' })
  status!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  total?: number;

  @Column({ type: 'text', nullable: true })
  delivery_address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  delivery_city?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  delivery_postal_code?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  delivery_phone?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'char', length: 36 })
  id_user_account!: string;

  @ManyToOne(() => UserAccount, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user_account' })
  user!: UserAccount;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items?: OrderItem[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment?: Payment;
}
