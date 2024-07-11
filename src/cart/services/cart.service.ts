import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart_item.entity';
import { CartItemDto } from '../dtos/create-cart-item.dto';
import { CartResponse } from '../models';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: Repository<Cart>,
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async findByUserId(userId: string): Promise<CartResponse | null> {
    const cart = await this.cartRepository.findOneBy({
      userId,
    });

    if (cart) {
      return new Cart(cart).toResponse();
    }
  }

  async createByUserId(userId: string): Promise<CartResponse> {
    const userCartDto = {
      userId: userId,
    };

    const createdCart = this.cartRepository.create(userCartDto);

    const savedCart = await this.cartRepository.save(createdCart);

    return new Cart(savedCart).toResponse();
  }

  async findOrCreateByUserId(userId: string): Promise<CartResponse> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    itemDtos: CartItemDto[],
  ): Promise<CartResponse> {
    const { id } = await this.findOrCreateByUserId(userId);

    const items = itemDtos.map((item) =>
      this.cartItemRepository.create({ ...item, cartId: id }),
    );

    await this.cartItemRepository.save(items);

    return await this.findByUserId(userId);
  }

  async removeByUserId(userId: string): Promise<void> {
    const result = await this.cartRepository.delete({ userId });

    if (result.affected !== 1) {
      throw new NotFoundException(`Cart for user=${userId} not found`);
    }
  }
}
