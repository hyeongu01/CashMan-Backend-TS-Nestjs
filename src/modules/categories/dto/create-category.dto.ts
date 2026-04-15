import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { AccountType } from '@common/constants/account-trype';

export class CreateCategoryDto {
  @ApiProperty()
  @IsEnum(AccountType)
  groupType: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
