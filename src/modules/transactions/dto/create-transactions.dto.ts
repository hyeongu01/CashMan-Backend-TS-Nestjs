import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionsDto {
  @ApiProperty()
  type: number;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  fromAccountId: string;

  @ApiProperty()
  toAccountId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  transactionDate: string;
}
