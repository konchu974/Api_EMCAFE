import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Index, OneToMany } from 'typeorm';
import { OrderItem } from './OrderItem';
import { ProductVariant } from './ProductVariant';

export enum CoffeeType {
  ARABICA = 'ARABICA',
  ROBUSTA = 'ROBUSTA',
  BLEND = 'BLEND',
  DECAFFEINATED = 'DECAFFEINATED',
  ORGANIC = 'ORGANIC'
}

export enum RoastLevel {
  LIGHT = 'LIGHT',
  MEDIUM = 'MEDIUM',
  DARK = 'DARK',
  EXTRA_DARK = 'EXTRA_DARK'
}

@Entity('product')
@Index(['name', 'category', 'is_active', 'price', 'intensity', 'coffee_type'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id_product!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column('int', { default: 0 })
  stock!: number;

  @Column('tinyint', { nullable: true, comment: 'Niveau d\'intensité du café (1-10)' })
  intensity?: number;

  @Column({ length: 50, nullable: true, comment: 'Format (ex: 250g, 500g, 1kg, 10 capsules)' })
  format?: string;

  @Column({
    type: 'enum',
    enum: CoffeeType,
    nullable: true,
    comment: 'Type de café'
  })
  coffee_type?: CoffeeType;

  @Column({ length: 100, nullable: true, comment: 'Origine du café (ex: Colombie, Brésil, Éthiopie)' })
  origin?: string;

  @Column({
    type: 'enum',
    enum: RoastLevel,
    nullable: true,
    comment: 'Niveau de torréfaction'
  })
  roast_level?: RoastLevel;

  @Column({ length: 255, nullable: true })
  image_url?: string;

  @Column({ length: 50, default: 'Coffee' })
  category!: string;

  @Column('tinyint', { default: 1 })
  is_active!: number;
  
  @Column({ type: 'varchar', length: 20, nullable: true })
  size?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  preparation?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  ingredient?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at!: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product, {
      cascade: false,  // ❌ Pas de cascade pour éviter les suppressions accidentelles
      onDelete: 'RESTRICT'  // ❌ Empêche la suppression d'un produit si des commandes existent
    })
    orderItems?: OrderItem[];  // ✅ Optionnel avec ?}

    @OneToMany(() => ProductVariant, (variant) => variant.product, {
        cascade: true,
        eager: false, // On charge les variants seulement quand nécessaire
      })
      variants: ProductVariant[];
    }