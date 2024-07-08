import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { Cart, CartItem } from '../models';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart | null> = {};

  findByUserId(userId: string): Cart | null {
    return this.userCarts[userId];
  }

  createByUserId(userId: string) {
    const id = randomUUID();
    const userCart = {
      id,
      items: [] as CartItem[],
    } as Cart;

    this.userCarts[userId] = userCart;

    return userCart;
  }

  findOrCreateByUserId(userId: string): Cart {
    const userCart = this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  updateByUserId(userId: string, { items }: Cart): Cart {
    const { id, ...rest } = this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    };

    this.userCarts[userId] = { ...updatedCart };

    return { ...updatedCart };
  }

  removeByUserId(userId: string): void {
    this.userCarts[userId] = null;
  }
}
