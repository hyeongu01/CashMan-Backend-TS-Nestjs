import { ApiProperty } from '@nestjs/swagger';
import { SortOrder } from '../dto/pagination.dto';

export class PaginationMeta {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  sortBy: string;

  @ApiProperty({ enum: SortOrder })
  sortOrder: SortOrder;

  constructor(
    page: number,
    limit: number,
    totalCount: number,
    sortBy: string,
    sortOrder: SortOrder,
  ) {
    this.page = page;
    this.limit = limit;
    this.totalCount = totalCount;
    this.totalPages = Math.ceil(totalCount / limit);
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
  }
}

export class PaginatedResponse<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty()
  meta: PaginationMeta;

  constructor(items: T[], meta: PaginationMeta) {
    this.items = items;
    this.meta = meta;
  }

  static of<T>(
    items: T[],
    options: {
      page: number;
      limit: number;
      totalCount: number;
      sortBy: string;
      sortOrder: SortOrder;
    },
  ): PaginatedResponse<T> {
    return new PaginatedResponse(
      items,
      new PaginationMeta(
        options.page,
        options.limit,
        options.totalCount,
        options.sortBy,
        options.sortOrder,
      ),
    );
  }
}
