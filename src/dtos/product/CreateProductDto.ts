import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  stock!: number;

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
