import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '@infra/prisma/prisma.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { type user, type category } from '@generated/prisma/client';
import { type CategoryResponse } from './response/category.response';
import {
  ApiSuccessResponse,
  ApiErrorResponse,
} from '@common/response/api-response';
import { ulid } from 'ulid';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: user, createCategoryDto: CreateCategoryDto) {
    const sameItem = await this.prismaService.category.findUnique({
      where: {
        userId_name_groupType: {
          userId: user.id,
          name: createCategoryDto.name,
          groupType: createCategoryDto.groupType,
        },
      },
    });
    if (sameItem) throw ApiErrorResponse.conflict();
    await this.prismaService.category.create({
      data: {
        id: ulid(),
        ...createCategoryDto,
        userId: user.id,
      },
    });

    return ApiSuccessResponse.of({});
  }

  async findAll(user: user) {
    const categories: category[] = await this.prismaService.category.findMany({
      where: { userId: user.id },
      take: 50,
    });

    return ApiSuccessResponse.of(
      categories.map(
        (category: category): CategoryResponse =>
          this.categoryWrapper(category),
      ),
    );
  }

  async update(
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiSuccessResponse<object>> {
    const { id, ...data } = updateCategoryDto;
    const oldCategory = await this.prismaService.category.findUnique({
      where: { id },
    });
    if (!oldCategory)
      throw ApiErrorResponse.notFound('id 에 해당하는 카테고리가 없습니다.');

    await this.prismaService.category.update({
      where: { id: updateCategoryDto.id },
      data: data,
    });
    return ApiSuccessResponse.of({});
  }

  async delete(user: user, id: string) {
    console.log(id, user);
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });
    if (!category || category.userId !== user.id)
      throw ApiErrorResponse.notFound('id 에 해당하는 카테고리가 없습니다.');
    console.log(category);

    await this.prismaService.category.delete({
      where: { id },
    });
    return ApiSuccessResponse.of({});
  }

  private categoryWrapper(category: category): CategoryResponse {
    return {
      id: category.id,
      groupType: category.groupType,
      name: category.name,
    };
  }
}
