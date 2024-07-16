import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { UsersModule } from 'src/users/users.module';
import { CartItem } from './entities/cart_item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    OrderModule,
    UsersModule,
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
