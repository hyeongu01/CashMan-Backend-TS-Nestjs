import { Post, Controller, UseGuards, Get, Body, Query } from '@nestjs/common';
import { TransactionsService } from '@modules/transactions/transactions.service';
import { AuthGuard } from '@common/guards/auth.guard';
import { CurrentUser } from '@common/decorators/user.decorator';
import { type user } from '@generated/prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateTransactionsDto } from '@modules/transactions/dto/create-transactions.dto';
import { ApiPaginatedResponse } from '@common/decorators/api-wrapped-response.decorator';
import { FindAllTransactionsResponse } from '@modules/transactions/response/findAll.response';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/response/pagination.response';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  create(
    @CurrentUser() user: user,
    @Body() createTransactionDto: CreateTransactionsDto,
  ) {
    return this.transactionsService.create(user, createTransactionDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiPaginatedResponse(FindAllTransactionsResponse)
  findAll(@CurrentUser() user: user, @Query() paginationDto: PaginationDto) {
    return this.transactionsService.findAll(user, paginationDto);
  }
}
