import { IsNotEmpty } from 'class-validator';
import { CartItem } from '../entities/cart_item.entity';

export class UpdateCartDto {
  @IsNotEmpty()
  items?: CartItem[];
}
