import { ApiProperty } from '@nestjs/swagger';
import { type category } from '@generated/prisma/client';

export class CategoryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupType: number;

  @ApiProperty()
  transactionType: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  iconKey: string;

  @ApiProperty()
  iconColor: string;

  static wrapper(category: category): CategoryResponse {
    return {
      id: category.id,
      groupType: category.groupType,
      transactionType: category.transactionType,
      name: category.name,
      iconKey: category.iconKey,
      iconColor: category.iconColor,
    } as CategoryResponse;
  }
}
