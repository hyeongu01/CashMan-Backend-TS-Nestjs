import {
  IsEmail,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthProvider } from '@common/constants/auth-provider';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(AuthProvider)
  provider: string;

  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;
}
