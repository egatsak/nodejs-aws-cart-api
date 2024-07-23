import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../models/models';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: false })
  cartId: string;

  @ManyToOne(() => Cart, (cart) => cart.items, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cart: Cart;

  @Column('jsonb', { nullable: false })
  product: Product;

  @Column('int')
  count: number;
}
