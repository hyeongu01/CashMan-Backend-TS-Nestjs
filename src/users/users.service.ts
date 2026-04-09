import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user } from '../generated/prisma/client';
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getItem(id: string): Promise<user | null> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async updateItem(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    this.prismaService.user.update({
      where: { id },
      data: { ...updateUserDto },
    })
  }
}
