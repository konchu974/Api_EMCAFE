import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsBoolean
} from 'class-validator';
import { CoffeeType } from '../../entities/enums/coffee-type.enum';
import { RoastLevel } from '../../entities/enums/roast-level.enum';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  intensity?: number;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @IsEnum(CoffeeType)
  coffee_type?: CoffeeType;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsEnum(RoastLevel)
  roast_level?: RoastLevel;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
