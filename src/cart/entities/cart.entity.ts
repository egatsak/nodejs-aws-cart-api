import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartResponse, CartStatuses } from '../models/models';
import { CartItem } from './cart_item.entity';
import { Transform } from 'class-transformer';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: false })
  userId: string;

  @CreateDateColumn({ nullable: false })
  @Transform((item) => item.value.getTime())
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  @Transform((item) => item.value.getTime())
  updatedAt: Date;

  @Column({ type: 'enum', enum: CartStatuses, default: CartStatuses.OPEN })
  status: CartStatuses;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];

  constructor(partial: Partial<Cart>) {
    Object.assign(this, partial);
  }

  toResponse() {
    return this as unknown as CartResponse;
  }
}
