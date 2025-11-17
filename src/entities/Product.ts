import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { OrderItem } from './OrderItem';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id_product!: string;

  @Column({ length: 100 })
  name!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('decimal', { precision: 15, scale: 2 })
  price!: number;

  @Column('int', { default: 0 })
  stock!: number;

  @Column({ length: 255, nullable: true })
  image_url?: string;

  @Column('text', { nullable: true })
  ingredient?: string;

  @Column('text', { nullable: true })
  preparation?: string;

   @ManyToMany(() => OrderItem, (orderItem) => orderItem.products)
  orderItems!: OrderItem[];
}
