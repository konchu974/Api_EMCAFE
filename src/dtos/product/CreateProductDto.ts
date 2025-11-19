import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsEnum,
  IsIn,
  IsBoolean
} from 'class-validator';
import { CoffeeType } from '../../entities/enums/coffee-type.enum';
import { RoastLevel } from '../../entities/enums/roast-level.enum';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  intensity!: number;

  @IsString()
  format!: string;

  @IsEnum(CoffeeType)
  coffee_type!: CoffeeType;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsEnum(RoastLevel)
  roast_level!: RoastLevel;

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
