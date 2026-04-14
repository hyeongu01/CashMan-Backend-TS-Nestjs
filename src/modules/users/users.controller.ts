import { Body, Controller, Get, Put, UseGuards, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@common/guards/auth.guard';
import { CurrentUser } from '@common/decorators/user.decorator';
import { type user } from '@generated/prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiErrorResponse, ApiSuccessResponse } from '@common/response/api-response';
import { ApiWrappedResponse } from '@common/decorators/api-wrapped-response.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 프로필 조회' })
  @ApiWrappedResponse(UserResponseDto)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getMyProfile(@CurrentUser() user: user): ApiSuccessResponse<UserResponseDto> {
    const data: UserResponseDto = UserResponseDto.from(user);
    return ApiSuccessResponse.of(data);
  }

  @Put('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로필 수정' })
  @ApiWrappedResponse()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateMyProfile(
    @CurrentUser() user: user,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiSuccessResponse<{}>> {
    const fields = Object.keys(updateUserDto);
    const hasChange = fields.some((key) => updateUserDto[key] && updateUserDto[key] !== user[key]);
    if (!hasChange) return ApiSuccessResponse.of({});

    const result: user | null = await this.usersService.updateItem(user.id, updateUserDto);
    if (!result) throw ApiErrorResponse.notFound('User not found');
    return ApiSuccessResponse.of({});
  }

  @Delete('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 프로필 삭제 (소프트)' })
  @ApiWrappedResponse()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteMyProfile(@CurrentUser() user: user) {
    await this.usersService.deleteItem(user.id);
    return ApiSuccessResponse.of({});
  }

}
