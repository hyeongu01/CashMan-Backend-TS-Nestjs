import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsIn } from 'class-validator';
import { AccountType } from '@common/constants/account-trype';
import { type TransactionType } from '@modules/transactions/types/transaction.type';

export class CreateCategoryDto {
  @ApiProperty()
  @IsEnum(AccountType)
  groupType: number;

  @ApiProperty({
    enum: [0, 1],
    description: '0: 지출, 1: 수입',
  })
  @IsIn([0, 1])
  transactionType: TransactionType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  iconKey: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  iconColor: string;
}
