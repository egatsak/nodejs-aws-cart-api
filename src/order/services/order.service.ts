import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(userId: string) {
    return await this.orderRepository.find({ where: { userId } });
  }

  async findById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new NotFoundException(`Order id=${orderId} not found`);
    }

    return order;
  }

  async create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create(createOrderDto);

    const savedOrder = await this.orderRepository.save(order);

    return savedOrder;
  }

  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.orderRepository.preload({
      id: orderId,
      ...updateOrderDto,
    });

    if (!order) {
      throw new NotFoundException(`Order id=${orderId} not found`);
    }

    await this.orderRepository.save(order);

    return order;
  }
}
