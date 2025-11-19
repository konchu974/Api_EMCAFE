// src/dtos/product/UpdateStockDto.ts
import { IsNumber, Min } from 'class-validator';

export class UpdateStockDto {
  @IsNumber({}, { message: 'La quantité doit être un nombre' })
  @Min(-1000, { message: 'La quantité minimum est -1000' }) 
  quantity: number;
}
