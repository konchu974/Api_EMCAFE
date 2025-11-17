import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

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
  image_url?: string;

  @IsOptional()
  @IsString()
  ingredient?: string;

  @IsOptional()
  @IsString()
  preparation?: string;
}
