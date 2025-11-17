import { 
  IsEmail, 
  IsString, 
  MinLength, 
  IsOptional, 
  IsEnum,
  Length,
  Matches
} from 'class-validator';
import { Gender } from '../../entities/UserAccount';

export class RegisterDto {
  @IsString()
  @Length(2, 50)
  first_name!: string;

  @IsString()
  @Length(2, 50)
  last_name!: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  @Matches(/^(\+33|0)[1-9](\d{2}){4}$/)
  phone?: string;

  @IsOptional()
  @IsString()
  address_line1?: string;

  @IsOptional()
  @IsString()
  address_line2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}$/)
  postal_code?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
