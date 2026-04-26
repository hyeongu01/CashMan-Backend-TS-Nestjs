import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponse } from '@modules/categories/response/category.response';
import { Transaction } from '@modules/transactions/types/transaction.type';

export class FindAllTransactionsResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: number;

  @ApiProperty({
    required: false,
  })
  category?: CategoryResponse;

  @ApiProperty()
  name: string;

  static wrapper(
    transaction: Transaction<['category']>,
  ): FindAllTransactionsResponse {
    return {
      id: transaction.id,
      type: transaction.type,
      ...(transaction.category && {
        category: CategoryResponse.wrapper(transaction.category),
      }),
      name: transaction.name,
    };
  }
}
