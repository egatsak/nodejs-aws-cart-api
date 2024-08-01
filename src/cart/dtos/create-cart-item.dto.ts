import {
  IsDefined,
  IsInt,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto {
  @IsUUID()
  id: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  title: string;

  @IsString()
  description?: string;
}

export class CartItemDto {
  @IsInt()
  @Min(0)
  count: number;

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;
}
