import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupType: number;

  @ApiProperty()
  name: string;
}
