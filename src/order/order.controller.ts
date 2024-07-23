import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { BasicAuthGuard } from 'src/auth/guards/bacis-auth.guard';
import { AppRequest } from 'src/shared/models';
import { getUserIdFromRequest } from 'src/shared/models-rules';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async getOrders(@Req() req: AppRequest) {
    const userId = getUserIdFromRequest(req);

    return await this.orderService.findAll(userId);
  }
}
