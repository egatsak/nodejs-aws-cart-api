import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services/cart.service';
import { OrderService } from 'src/order/services/order.service';
import { AppRequest } from 'src/shared/models';
import { getUserIdFromRequest } from 'src/shared/models-rules';
import { BasicAuthGuard } from 'src/auth/guards/bacis-auth.guard';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    console.log(getUserIdFromRequest(req));

    console.log('wow');
    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );
    //
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, total: calculateCartTotal(cart) },
    };
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    // TODO: validate body payload...
    console.log(body);
    const cart = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      body,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: calculateCartTotal(cart),
      },
    };
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest): Promise<void> {
    return await this.cartService.removeByUserId(getUserIdFromRequest(req));
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode;

      return {
        statusCode,
        message: 'Cart is empty',
      };
    }

    const total = calculateCartTotal(cart);
    const order = await this.orderService.create({
      ...body, // TODO: validate and pick only necessary data
      userId,
      cartId: cart.id,
      total,
    });
    if (order) {
      this.cartService.updateByUserId(userId, null, true);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order },
    };
  }
}
