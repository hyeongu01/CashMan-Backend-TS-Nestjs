import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Timezone } from '@common/constants/timezone';
import { CurrencyCode } from '@common/constants/currency';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  birthDate?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(Timezone))
  @IsOptional()
  @ApiProperty({ required: false })
  timezone?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(CurrencyCode))
  @IsOptional()
  @ApiProperty({ required: false })
  currency?: string;
}
