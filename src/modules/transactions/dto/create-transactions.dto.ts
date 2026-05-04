import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateTransactionsDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(5)
  type: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsString()
  accountId: string;

  @ApiProperty()
  @IsInt()
  amount: number;

  @ApiProperty()
  @IsDateString()
  transactionDate: string;

  @ApiProperty()
  @IsString()
  name: string;
}
