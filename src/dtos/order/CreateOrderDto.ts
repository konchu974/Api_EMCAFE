import { IsString, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  id_product!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  id_user_account!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
