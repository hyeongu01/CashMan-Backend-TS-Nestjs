import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user } from '../generated/prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getItem(id: string): Promise<user | null> {
    return this.prismaService.user.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async updateItem(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<user | null> {
    try {
      return await this.prismaService.user.update({
        where: { id, deletedAt: null },
        data: updateUserDto,
      });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.code === 'P2025') return null;
      throw e;
    }
  }

  async deleteItem(id: string): Promise<void> {
    await this.prismaService.user.delete({where: { id }});
  }
}
