import { PrismaService } from '@infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { type user } from '@generated/prisma/client';
import { CreateTransactionsDto } from '@modules/transactions/dto/create-transactions.dto';
import { ApiSuccessResponse } from '@common/response/api-response';
import { ulid } from 'ulid';
import { FindAllTransactionsResponse } from '@modules/transactions/response/findAll.response';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/response/pagination.response';

@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    user: user,
    createTransactionDto: CreateTransactionsDto,
  ): Promise<ApiSuccessResponse<object>> {
    await this.prismaService.transaction.create({
      data: {
        id: ulid(),
        ...createTransactionDto,
        userId: user.id,
        currency: user.currency,
        transactionDate: new Date(createTransactionDto.transactionDate),
      },
    });
    return ApiSuccessResponse.of({});
  }

  async findAll(
    user: user,
    paginationDto: PaginationDto,
  ): Promise<
    ApiSuccessResponse<PaginatedResponse<FindAllTransactionsResponse>>
  > {
    const [count, transactions] = await this.prismaService.$transaction([
      this.prismaService.transaction.count({
        where: {
          userId: user.id,
        },
      }),
      this.prismaService.transaction.findMany({
        where: {
          userId: user.id,
        },
        include: {
          category: true,
        },
        skip: paginationDto.skip,
        take: paginationDto.limit,
        orderBy: paginationDto.orderBy,
      }),
    ]);

    return ApiSuccessResponse.of(
      PaginatedResponse.of(
        transactions.map((t) => FindAllTransactionsResponse.wrapper(t)),
        {
          ...paginationDto,
          totalCount: count,
        },
      ),
    );
  }
}
