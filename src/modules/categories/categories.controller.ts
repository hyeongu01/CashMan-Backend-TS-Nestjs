import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@common/guards/auth.guard';
import { type user } from '@generated/prisma/client';
import { CurrentUser } from '@common/decorators/user.decorator';
import { ApiOperation, ApiOkResponse, ApiResponse } from '@nestjs//swagger';
import { ApiWrappedResponse } from '@common/decorators/api-wrapped-response.decorator';
import { ApiSuccessResponse } from '@common/response/api-response';
import { CategoryResponse } from './response/category.response';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '카테고리 생성' })
  @ApiWrappedResponse()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async create(
    @CurrentUser() user: user,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(user, createCategoryDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '카테고리 확인' })
  @ApiWrappedResponse(CategoryResponse, { isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findAll(@CurrentUser() user: user) {
    return this.categoriesService.findAll(user);
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '카테고리 수정' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiWrappedResponse()
  async update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(updateCategoryDto);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '카테고리 삭제' })
  @ApiWrappedResponse()
  async delete(@CurrentUser() user: user, @Body('id') id: string) {
    return this.categoriesService.delete(user, id);
  }
}
