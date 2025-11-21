import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Product } from './Product';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid', { name: 'id_variant' })
  idVariant: string;

  @Column({ name: 'product_id', type: 'char', length: 36 })
  @Index('idx_product_id')
  productId: string;

  @Column({ type: 'varchar', length: 50 })
  format: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  sku: string | null;

  @Column({ name: 'is_active', type: 'tinyint', width: 1, default: 1 })
  @Index('idx_is_active')
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
