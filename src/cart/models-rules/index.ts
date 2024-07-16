import { CartResponse, CartItem } from '../models/models';

/**
 * @param {Cart} cart
 * @returns number
 */
export function calculateCartTotal(cart: CartResponse): number {
  return cart?.items
    ? cart.items.reduce((acc: number, { price, count }: CartItem) => {
        return (acc += price * count);
      }, 0)
    : 0;
}
