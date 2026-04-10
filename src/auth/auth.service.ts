import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NaverCallbackDto } from './dto/naver-callback.dto';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { NaverProfileDto } from './dto/naver-profile.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { type user } from '../generated/prisma/client';
import { ulid } from 'ulid';
import { AccountType } from '../common/constants/account-trype';
import { CurrencyCode } from '../common/constants/currency';
import { JwtService } from '@nestjs/jwt';
import { ApiSuccessResponse } from '../common/response/api-response';
import { LoginResponseDto } from './dto/login-response.dto';
import { sha256 } from '../common/utils/hash';
import {
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_MS,
} from '../common/constants/auth';
import { NaverApiService } from './oauth/naver-api.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private naverApiService: NaverApiService,
  ) {}

  generateNaverLoginUrl() {
    const clientId = this.configService.get<string>('NAVER_CLIENT_ID');
    const redirectUri = this.configService.get<string>('NAVER_REDIRECT_URI');
    if (!clientId || !redirectUri)
      throw new InternalServerErrorException('Naver 설정이 누락되었습니다.');

    // TODO: 추후 redis 캐싱 예정
    const state: string = 'status';
    return (
      'https://nid.naver.com/oauth2.0/authorize?response_type=code' +
      `&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
    );
  }

  async naverLogin(naverCallbackDto: NaverCallbackDto) {
    // TODO: redis 에서 state 검증 로직 추가

    const { accessToken, tokenType } =
      await this.naverApiService.getAccessToken(naverCallbackDto);
    const loginDto = await this.naverApiService.getProfile(
      tokenType,
      accessToken,
    );

    return await this.login(loginDto);
  }

  async login(params: LoginDto) {
    let user: user | null = await this.prismaService.user.findFirst({
      where: {
        auths: {
          some: { provider: params.provider, providerId: params.providerId },
        },
      },
    });
    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          id: ulid(),
          name: params.name,
          birthDate: params.birthDate ? new Date(params.birthDate) : null,
          auths: {
            create: {
              provider: params.provider,
              providerId: params.providerId,
            },
          },
          accounts: {
            createMany: {
              data: [
                {
                  id: ulid(),
                  groupType: AccountType.DEFAULT,
                  currency: CurrencyCode.KRW,
                },
                {
                  id: ulid(),
                  groupType: AccountType.DEPOSIT,
                  currency: CurrencyCode.KRW,
                },
                {
                  id: ulid(),
                  groupType: AccountType.INVESTMENT,
                  currency: CurrencyCode.KRW,
                },
              ],
            },
          },
        },
      });
    }

    const deviceId = ulid();
    const tokens: LoginResponseDto = this.generateTokens(user, deviceId);
    const hashedRefreshToken = sha256(tokens.refreshToken);

    await this.prismaService.refresh_token.upsert({
      where: { userId_deviceId: { userId: user.id, deviceId } },
      create: {
        userId: user.id,
        deviceId,
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
      },
      update: {
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
      },
    });
    return ApiSuccessResponse.of(tokens);
  }

  private generateTokens(user: user, deviceId: string): LoginResponseDto {
    const payload = { id: user.id };
    const payloadRefresh = { id: user.id, deviceId };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payloadRefresh, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
    return { accessToken, refreshToken };
  }
  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }
  //
  // findAll() {
  //   return `This action returns all auth`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }
  //
  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
