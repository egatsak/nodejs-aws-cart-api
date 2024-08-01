import { CartItem } from '../../cart/models/models';
import { Delivery, Payment } from '../order.interface';

export type Order = {
  id?: string;
  userId: string;
  cartId: string;
  items: CartItem[];
  payment: Payment;
  delivery: Delivery;
  comments: string;
  status: OrderStatus;
  total: number;
};

export enum OrderStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PAID = 'PAID',
  DELIVERED = 'DELIVERED',
}
