import { PrismaService } from '@infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { type user } from '@generated/prisma/client';
import { CreateTransactionsDto } from '@modules/transactions/dto/create-transactions.dto';
import { ApiSuccessResponse } from '@common/response/api-response';
import { ulid } from 'ulid';
import { FindAllTransactionsResponse } from '@modules/transactions/response/findAll.response';
import { Transaction } from '@modules/transactions/types/transaction.type';

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
  ): Promise<ApiSuccessResponse<FindAllTransactionsResponse[]>> {
    const transactions: Transaction<['category']>[] =
      await this.prismaService.transaction.findMany({
        where: { userId: user.id },
        include: {
          category: true,
        },
      });

    return ApiSuccessResponse.of(
      transactions.map(
        (t: Transaction<['category']>): FindAllTransactionsResponse =>
          FindAllTransactionsResponse.wrapper(t),
      ),
    );
  }
}
