import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  status!: string;
}
