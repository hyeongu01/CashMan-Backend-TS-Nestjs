import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@common/guards/auth.guard';
import { type user } from '@generated/prisma/client';
import { CurrentUser } from '@common/decorators/user.decorator';
import { ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from '@common/dto/pagination.dto';
import { ApiSuccessResponse } from '@common/response/api-response';
import { PaginatedResponse } from '@common/response/pagination.response';
import { AccountResponse } from './response/account.response';
import { ApiPaginatedResponse } from '@common/decorators/api-wrapped-response.decorator';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 계좌 조회' })
  @ApiPaginatedResponse(AccountResponse)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getMyAccounts(
    @CurrentUser() user: user,
    @Query() paginationDto: PaginationDto,
  ): Promise<ApiSuccessResponse<PaginatedResponse<AccountResponse>>> {
    return await this.accountsService.getMyAccounts(user, paginationDto);
  }
}
