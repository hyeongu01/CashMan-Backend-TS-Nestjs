import { ApiProperty } from '@nestjs/swagger';
import { type category } from '@generated/prisma/client';

export class CategoryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupType: number;

  @ApiProperty()
  name: string;

  static wrapper(category: category): CategoryResponse {
    return {
      id: category.id,
      groupType: category.groupType,
      name: category.name,
    } as CategoryResponse;
  }
}
