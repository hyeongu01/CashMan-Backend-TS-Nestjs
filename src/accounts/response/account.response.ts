import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '../../common/constants/account-trype';
import { CurrencyCode } from '../../common/constants/currency';

export class AccountResponse {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: AccountType })
  groupType: number;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: CurrencyCode })
  currency: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
