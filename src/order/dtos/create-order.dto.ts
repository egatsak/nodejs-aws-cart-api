import { CartItem } from 'src/cart/models';
import { Delivery, Payment } from '../order.interface';
import { OrderStatus } from '../models';

export type CreateOrderDto = {
  userId: string;
  cartId: string;
  items: CartItem[];
  payment: Payment;
  delivery: Delivery;
  total: number;
  comments?: string;
  status?: OrderStatus;
};