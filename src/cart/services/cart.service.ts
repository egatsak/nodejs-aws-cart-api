import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart_item.entity';
import { CartItemDto } from '../dtos/create-cart-item.dto';
import { CartResponse, CartStatuses } from '../models/models';
import { CreateOrderDto } from 'src/order/dtos/create-order.dto';
import { OrderService } from 'src/order/services/order.service';
import { calculateCartTotal } from '../models-rules';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private orderService: OrderService,
    private dataSource: DataSource,
  ) {}
  async findById(cartId: string) {
    const cart = await this.cartRepository.findOneBy({ id: cartId });

    if (!cart) {
      throw new NotFoundException(`Cart id=${cartId} not found.`);
    }

    return cart.toResponse();
  }

  async findByUserId(userId: string): Promise<CartResponse> {
    const cart = await this.cartRepository.findOneBy({
      userId,
    });

    if (cart) {
      return cart.toResponse();
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
    itemDto: CartItemDto | null,
    isCheckout?: boolean,
  ): Promise<CartResponse> {
    const cart = await this.findOrCreateByUserId(userId);

    if (itemDto) {
      const cartItem = await this.cartItemRepository.findOne({
        where: {
          productId: itemDto.productId,
          cartId: cart.id,
        },
      });

      if (cartItem) {
        if (itemDto.count === 0) {
          await this.cartItemRepository.delete({ id: cartItem.id });
        } else {
          await this.cartItemRepository.save({
            ...cartItem,
            count: itemDto.count,
          });
        }
      } else {
        const createdCartItem = this.cartItemRepository.create({
          ...itemDto,
          cartId: cart.id,
        });
        await this.cartItemRepository.save(createdCartItem);
      }
    }

    if (isCheckout) {
      await this.cartRepository.save({ ...cart, status: CartStatuses.ORDERED });
    }

    return await this.findById(cart.id);
  }

  async removeByUserId(userId: string): Promise<void> {
    const result = await this.cartRepository.delete({ userId });

    if (result.affected !== 1) {
      throw new NotFoundException(`Cart for user=${userId} not found`);
    }
  }

  async checkout(userId: string, createOrderDto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await this.findByUserId(userId);

      if (!(cart && cart.items.length)) {
        throw new BadRequestException('Cart is empty');
      }
      const total = calculateCartTotal(cart);
      const order = await this.orderService.create({
        ...createOrderDto,
        userId,
        cartId: cart.id,
        total,
      });

      if (order) {
        this.updateByUserId(userId, null, true);
      }

      await queryRunner.commitTransaction();
      return order;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
