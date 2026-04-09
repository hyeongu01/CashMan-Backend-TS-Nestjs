import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { type user } from '../generated/prisma/client';
import { ApiResponse } from '../common/response/api-response';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 프로필 조회' })
  getMyProfile(@CurrentUser() user: user) {
    return ApiResponse.success(user);
  }

  @Put('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로필 수정' })
  updateMyProfile(
    @CurrentUser() user: user,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return '';
  }
}
