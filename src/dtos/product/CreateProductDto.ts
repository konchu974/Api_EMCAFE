import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsEnum,
  IsBoolean,
  MaxLength
} from 'class-validator';
import { CoffeeType } from '../../entities/enums/coffee-type.enum';
import { RoastLevel } from '../../entities/enums/roast-level.enum';

export class CreateProductDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  intensity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  format?: string;

  @IsOptional()
  @IsEnum(CoffeeType)
  coffee_type?: CoffeeType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  origin?: string;

  @IsOptional()
  @IsEnum(RoastLevel)
  roast_level?: RoastLevel;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  image_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
  
  @IsOptional()
  @IsString()
  @MaxLength(20)
  size?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  preparation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  ingredient?: string;

}
