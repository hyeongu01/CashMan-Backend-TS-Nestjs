import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import {UpdateUserDto} from "./dto/update-user.dto";
import {user} from "../generated/prisma/client";

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get(UsersService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getItem', () => {
    it('should return a user by id', async () => {});

    it('should return null if user not found', async () => {});
  });

  describe('updateItem', () => {
    it.skip('should be successfully updated the user', async () => {
      const mockupUser: user = {
        id: '1234',
        name: '현우',
        timezone: 'Asia/Seoul',
        currency: 'KRW',
        birthDate: new Date('2000-01-01'),
        createdAt: new Date(),
        deletedAt: null,
      };
      const mockupBody: UpdateUserDto = {
        name: 'John Doe',
      };
      service.updateItem(mockupUser, mockupBody);
    })
  });
});
