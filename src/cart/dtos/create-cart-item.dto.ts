import { CartItem } from '../entities/cart_item.entity';

export type CartItemDto = Pick<CartItem, 'productId' | 'count' | 'price'>;
