import { Injectable } from '@nestjs/common';
import { type user, type account } from '../generated/prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResponse } from '../common/response/pagination.response';
import { AccountResponse } from './response/account.response';
import { ApiSuccessResponse } from '../common/response/api-response';

@Injectable()
export class AccountsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMyAccounts(
    user: user,
    paginationDto: PaginationDto,
  ): Promise<ApiSuccessResponse<PaginatedResponse<AccountResponse>>> {
    const [items, count] = await this.prismaService.$transaction([
      this.prismaService.account.findMany({
        where: { userId: user.id },
        orderBy: paginationDto.orderBy,
        skip: paginationDto.skip,
        take: paginationDto.limit,
      }),
      this.prismaService.account.count({ where: { userId: user.id } }),
    ]);

    return ApiSuccessResponse.of(
      PaginatedResponse.of(
        items,
        paginationDto.page,
        paginationDto.limit,
        count,
        paginationDto.sortBy,
        paginationDto.sortOrder,
      ),
    );
  }
}
