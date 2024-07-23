import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { typeOrmConfig } from './typeorm.config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Order } from './order/entities/order.entity';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cart_item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...typeOrmConfig,
        entities: [User, Order, Cart, CartItem],
        host: configService.get<string>('POSTGRES_HOST'),
        port: +configService.get<string>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
      }),
    }),
    AuthModule,
    CartModule,
    OrderModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
