import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@modules/users/users.service';
import {ExecutionContext} from "@nestjs/common";

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockRequest = {
    headers: { authorization: 'Bearer some-token' },
  };
  const mockContext = {
    switchToHttp: () => ({
      getRequest: mockRequest,
    }),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        { provide: UsersService, useValue: { getItem: jest.fn() } },
      ],
    }).compile();

    guard = module.get(AuthGuard);
    jwtService = module.get(JwtService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if no authorization header', async () => {

  });

  // it('should throw UnauthorizedException if token does not start with Bearer', async () => {});
  //
  // it('should throw UnauthorizedException if token is invalid', async () => {});
  //
  // it('should throw UnauthorizedException if user not found', async () => {});
  //
  // it('should set request.user and return true for valid token', async () => {});
});
