import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserAccount } from './UserAccount';

@Entity('password_reset_token')
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id_token!: string;

  @Column({ type: 'char', length: 36 })
  id_user_account!: string;

  @Column({ length: 255 })
  token!: string;

  @Column({ type: 'datetime' })
  expires_at!: Date;

  @Column({ type: 'boolean', default: false })
  used!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => UserAccount, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user_account' })
  user!: UserAccount;
}
