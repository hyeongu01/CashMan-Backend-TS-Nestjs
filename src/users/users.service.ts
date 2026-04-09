import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user } from '../../prisma/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getItem(id: string): Promise<user | null> {
    return this.prismaService.user.findUnique({ where: { id } });
  }
}
