import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NaverCallbackDto } from './dto/naver-callback.dto';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { NaverProfileDto } from './dto/naver-profile.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { type user } from '../../prisma/generated/prisma/client';
import { ulid } from 'ulid';
import { AccountType } from '../common/constants/account-trype';
import { CurrencyCode } from '../common/constants/currency';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse } from '../common/response/api-response';
import { LoginResponseDto } from './dto/login-response.dto';
import { sha256 } from '../common/utils/hash';
import {
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_MS,
} from '../common/constants/auth';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
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

    // access_token 발급 (네이버 서버 jwt)
    const tokenResult = await axios.get(
      'https://nid.naver.com/oauth2.0/token',
      {
        params: {
          grant_type: 'authorization_code',
          client_id: this.configService.get<string>('NAVER_CLIENT_ID'),
          client_secret: this.configService.get<string>('NAVER_CLIENT_SECRET'),
          redirect_uri: this.configService.get<string>('NAVER_REDIRECT_URI'),
          ...naverCallbackDto,
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { access_token, token_type } = tokenResult.data;

    // profile 조회
    const profileResult = await axios.get(
      'https://openapi.naver.com/v1/nid/me',
      {
        headers: { Authorization: `${token_type} ${access_token}` },
      },
    );
    const profile = plainToInstance(
      NaverProfileDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      profileResult.data.response,
    );
    await validateOrReject(profile);

    if (!profile.name)
      throw new InternalServerErrorException(
        '네이버 프로필에 이름이 없습니다.',
      );

    return await this.login({
      provider: 'NAVER',
      providerId: profile.id,
      name: profile.name,
      birthDate: ((): string | undefined => {
        const date = new Date(`${profile.birthyear}-${profile.birthday}`);
        return isNaN(date.getTime())
          ? undefined
          : date.toISOString().split('T')[0];
      })(),
    });
  }

  private async login(params: LoginDto) {
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
    return ApiResponse.success(tokens);
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
