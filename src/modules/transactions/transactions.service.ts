import { PrismaService } from '@infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { type user, type transaction } from '@generated/prisma/client';
import { CreateTransactionsDto } from '@modules/transactions/dto/create-transactions.dto';
import { ApiSuccessResponse } from '@common/response/api-response';

@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    user: user,
    createTransactionDto: CreateTransactionsDto,
  ): Promise<ApiSuccessResponse<object>> {
    await this.prismaService.transaction.create({
      data: {
        ...createTransactionDto,
        userId: user.id,
        currency: user.currency,
      },
    });
    return ApiSuccessResponse.of({});
  }

  async findAll(user: user): Promise<ApiSuccessResponse<transaction[]>> {
    const transactions: transaction[] =
      await this.prismaService.transaction.findMany({
        where: { userId: user.id },
      });

    return ApiSuccessResponse.of(transactions);
  }
}
