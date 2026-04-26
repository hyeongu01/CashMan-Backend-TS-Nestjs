import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponse } from '@modules/categories/response/category.response';

export class FindAllTransactionsResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: number;

  @ApiProperty()
  category: CategoryResponse;
}
