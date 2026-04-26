import {
  Post,
  Controller,
  UseGuards,
  Get,
  Body,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { TransactionsService } from '@modules/transactions/transactions.service';
import { AuthGuard } from '@common/guards/auth.guard';
import { CurrentUser } from '@common/decorators/user.decorator';
import { type user } from '@generated/prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTransactionsDto } from '@modules/transactions/dto/create-transactions.dto';
import {
  ApiPaginatedResponse,
  ApiWrappedResponse,
} from '@common/decorators/api-wrapped-response.decorator';
import { FindAllTransactionsResponse } from '@modules/transactions/response/findAll.response';
import { PaginationDto } from '@common/dto/pagination.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiWrappedResponse()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '거래 생성' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
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
  @ApiOperation({ summary: '모든 거래 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  findAll(@CurrentUser() user: user, @Query() paginationDto: PaginationDto) {
    return this.transactionsService.findAll(user, paginationDto);
  }
}
