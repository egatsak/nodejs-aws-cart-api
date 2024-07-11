import { Column, Entity, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class CartItem {
  @Column()
  cartId: string;

  @ManyToOne(() => Cart, (cart) => cart.id)
  cart: Cart;

  @Column('uuid')
  productId: string;

  @Column('int')
  count: number;
}
