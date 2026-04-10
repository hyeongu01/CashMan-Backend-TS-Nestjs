import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { user } from '../generated/prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: { getItem: jest.fn() } },
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Get /auth/users 포멧 검증', () => {
    const mockupUser = { id: '01ABC', name: '홍길동' };
    const result = controller.getMyProfile(mockupUser as user);
    expect(result).toHaveProperty('data', mockupUser);
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('statusCode', 200);
    expect(result).toHaveProperty('message');
  });

  // it.skip('', () => {});
});
