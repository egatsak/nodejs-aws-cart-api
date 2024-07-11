import { Column, Entity, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class CartItem {
  @Column('uuid', { nullable: false })
  cartId: string;

  @ManyToOne(() => Cart, (cart) => cart.id, { nullable: false })
  cart: Cart;

  @Column('uuid', { nullable: false })
  productId: string;

  @Column('int')
  count: number;
}
