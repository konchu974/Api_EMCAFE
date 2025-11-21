import { IsString, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  productId: string;

  @IsString()
  format: string; // Ex: "500g", "1kg"

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
