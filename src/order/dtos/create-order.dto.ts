import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../models';
import { Delivery, Payment } from '../order.interface';
import { CartItem } from '../../cart/models/models';
import { CartItemDto } from '../../cart/dtos/create-cart-item.dto';

export class CreateOrderDto {
  /*  @IsUUID() */
  userId: string;

  /*  @IsUUID() */
  cartId: string;

  @IsOptional()
  /*  @ValidateNested({ each: true })
  @IsDefined()
  @ValidateNested()
  @Type(() => typeof {
    count: number;
    productId: string;
  }) */
  items?: { productId: string; count: number }[];

  /*  payment?: Payment;

  delivery?: Delivery; */
  /* 
  @IsInt()
  @Min(0) */
  total: number;

  @IsString()
  comments?: string;
  /* 
  @IsEnum(OrderStatus)
  status?: OrderStatus; */
}
