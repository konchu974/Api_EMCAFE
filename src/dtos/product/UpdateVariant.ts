import { IsString, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator';

export class UpdateVariantDto {
  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
