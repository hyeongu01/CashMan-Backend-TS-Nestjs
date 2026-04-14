import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@infra/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {NaverApiService} from "./oauth/naver-api.service";

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn(), getOrThrow: jest.fn() },
        },
        {
          provide: PrismaService,
          useValue: {
            user: { findFirst: jest.fn(), create: jest.fn() },
            refresh_token: { upsert: jest.fn() },
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
        {
          provide: NaverApiService,
          useValue: {
            getAccessToken: jest.fn(),
            getProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    configService = module.get(ConfigService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('generateNaverLoginUrl', () => {
  //   it('should return a valid Naver OAuth URL', () => {});
  //
  //   it('should throw if NAVER_CLIENT_ID is missing', () => {});
  //
  //   it('should throw if NAVER_REDIRECT_URI is missing', () => {});
  // });
  //
  // describe('naverLogin', () => {
  //   it('should exchange code for token and return login response', async () => {});
  //
  //   it('should throw if Naver API returns invalid profile', async () => {});
  //
  //   it('should throw if profile name is missing', async () => {});
  // });
  //
  // describe('login (via naverLogin)', () => {
  //   it('should create new user with 3 default accounts if not exists', async () => {});
  //
  //   it('should return tokens for existing user', async () => {});
  //
  //   it('should hash refresh token and store it', async () => {});
  //
  //   it('should generate access and refresh tokens', async () => {});
  // });
});
