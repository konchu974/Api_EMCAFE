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

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_order' })
  order!: Order;

  @ManyToMany(() => Product, (product) => product.orderItems)
  @JoinTable({
    name: 'order_item_product',
    joinColumn: { name: 'id_order_item', referencedColumnName: 'id_order_item' },
    inverseJoinColumn: { name: 'id_product', referencedColumnName: 'id_product' },
  })
  products!: Product[];
    orderItemProducts: any;
}
