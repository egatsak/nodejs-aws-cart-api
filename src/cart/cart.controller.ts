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
  HttpException,
  HttpCode,
} from '@nestjs/common';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services/cart.service';
import { AppRequest } from 'src/shared/models';
import { getUserIdFromRequest } from 'src/shared/models-rules';
import { BasicAuthGuard } from 'src/auth/guards/bacis-auth.guard';
import { CreateOrderDto } from 'src/order/dtos/create-order.dto';
import { CartItemDto } from './dtos/create-cart-item.dto';

@Controller('api/profile/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    console.log(getUserIdFromRequest(req));

    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, total: calculateCartTotal(cart) },
    };
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body: CartItemDto) {
    // TODO: validate body payload...
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
  @HttpCode(204)
  async clearUserCart(@Req() req: AppRequest): Promise<void> {
    return await this.cartService.removeByUserId(getUserIdFromRequest(req));
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body: CreateOrderDto) {
    // TODO: validate and pick only necessary data from body

    const userId = getUserIdFromRequest(req);

    try {
      const order = await this.cartService.checkout(userId, body);
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { order },
      };
    } catch (e: unknown) {
      throw e;
    }
  }
}
