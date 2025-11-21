import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id_order_item!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  subtotal?: number;

  @Column({ type: 'char', length: 36 })
  id_order!: string;
  
  @Column({ type: 'char', length: 36 })  // ✅ Ajout de la colonne
    id_product!: string;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_order' })
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'id_product' })
    product!: Product;
}
