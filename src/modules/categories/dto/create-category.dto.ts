import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { AccountType } from '@common/constants/account-trype';

export class CreateCategoryDto {
  @ApiProperty()
  @IsEnum(AccountType)
  groupType: number;

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
