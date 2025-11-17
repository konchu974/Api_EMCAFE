import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from './Order';
import { PasswordResetToken } from './PasswordResetToken';

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  OTHER = 'OTHER',
}

export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

@Entity('user_account')
export class UserAccount {
  @PrimaryGeneratedColumn('uuid')
  id_user_account!: string;

  @Column({ length: 50 })
  first_name!: string;

  @Column({ length: 50 })
  last_name!: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @Column({ length: 100, unique: true })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ length: 255, nullable: true })
  address_line1?: string;

  @Column({ length: 255, nullable: true })
  address_line2?: string;

  @Column({ length: 100, nullable: true })
  city?: string;

  @Column({ length: 20, nullable: true })
  postal_code?: string;

  @Column({ length: 100, default: 'France' })
  country!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role!: UserRole;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => PasswordResetToken, (token) => token.user)
  passwordResetTokens!: PasswordResetToken[];
}
