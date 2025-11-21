// src/entities/Order.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne
} from 'typeorm';
import { UserAccount } from './UserAccount';  
import { OrderItem } from './OrderItem';
import { Payment } from './Payment';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id_order!: string;

  @ManyToOne(() => UserAccount, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user_account' })
  user!: UserAccount;  // ⚠️ Changé de User

  @Column({ type: 'char', length: 36, name: 'id_user_account' })
  id_user_account!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @Column({
     type: 'varchar',
     length: 50,
     default: OrderStatus.PENDING  
   })
   status!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  delivery_address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  delivery_city?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  delivery_postal_code?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  delivery_phone?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems!: OrderItem[];
  
  @OneToOne(() => Payment, (payment) => payment.order, { nullable: true })
   payment?: Payment;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at!: Date;
}
