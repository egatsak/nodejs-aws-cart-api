import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './services/order.service';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
