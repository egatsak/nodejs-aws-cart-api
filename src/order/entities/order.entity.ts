import { Cart } from '../../cart/entities/cart.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Delivery, Payment } from '../order.interface';
import { OrderStatus } from '../models';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  cartId: string;

  @OneToOne(() => Cart, (cart) => cart.id, { eager: true })
  cart: Cart;

  @Column('json', {
    default: {
      type: 'credit card',
    } satisfies Payment,
  })
  payment: Payment;

  @Column('json', {
    default: {} satisfies Delivery,
  })
  delivery: Delivery;

  @Column()
  comments?: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.IN_PROGRESS })
  status: OrderStatus;

  @Column()
  total: number;
}
