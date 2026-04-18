import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { NaverCallbackDto } from './dto/naver-callback.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '@infra/prisma/prisma.service';
import { type user } from '@generated/prisma/client';
import { ulid } from 'ulid';
import { AccountType } from '@common/constants/account-trype';
import { CurrencyCode } from '@common/constants/currency';
import { JwtService } from '@nestjs/jwt';
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from '@common/response/api-response';
import { LoginResponse } from './response/login.response';
import { sha256 } from '@common/utils/hash';
import {
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_MS,
} from '@common/constants/auth';
import { NaverApiService } from './oauth/naver-api.service';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshResponse } from './response/refresh.response';
import { JwtPayload, JwtRefreshPayload } from './types/jwt-payload.types';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private naverApiService: NaverApiService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async generateNaverLoginUrl(redirectUrl: string) {
    const clientId = this.configService.get<string>('NAVER_CLIENT_ID');
    const redirectUri = this.configService.get<string>('NAVER_REDIRECT_URI');
    if (!clientId || !redirectUri)
      throw new InternalServerErrorException('Naver 설정이 누락되었습니다.');

    const state: string = crypto.randomUUID();
    await this.cacheManager.set(
      `naverState:${state}`,
      redirectUrl,
      5 * 60 * 1000,
    );
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
    });
    console.log(state, redirectUrl);

    const url = `https://nid.naver.com/oauth2.0/authorize?${params}`;
    return ApiSuccessResponse.of({ url });
  }

  async naverLogin(naverCallbackDto: NaverCallbackDto) {
    const cacheKey = `naverState:${naverCallbackDto.state}`;
    const redirectUrl = await this.cacheManager.get<string>(cacheKey);

    if (!redirectUrl)
      throw ApiErrorResponse.unauthorized('유효하지 않은 state 입니다.');

    await this.cacheManager.del(cacheKey);

    const { accessToken, tokenType } =
      await this.naverApiService.getAccessToken(naverCallbackDto);
    const loginDto = await this.naverApiService.getProfile(
      tokenType,
      accessToken,
    );

    const tokens = await this.login(loginDto);
    return { tokens, redirectUrl };
  }

  async login(params: LoginDto) {
    let user: user | null = await this.prismaService.user.findFirst({
      where: {
        auths: {
          some: { provider: params.provider, providerId: params.providerId },
        },
      },
    });
    if (!user) user = await this.createUser(params);

    const deviceId = ulid();
    const tokens: LoginResponse = this.generateTokens(user, deviceId);
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
    return tokens;
  }

  private generateTokens(user: user, deviceId: string): LoginResponse {
    const payload: JwtPayload = { id: user.id };
    const payloadRefresh: JwtRefreshPayload = { id: user.id, deviceId };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payloadRefresh, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
    return { accessToken, refreshToken, tokenType: 'bearer' };
  }

  private async createUser(params: LoginDto): Promise<user> {
    const emailCheck: user | null = await this.prismaService.user.findUnique({
      where: { email: params.email },
    });
    if (emailCheck)
      throw ApiErrorResponse.conflict('이미 사용중인 이메일입니다.');
    return this.prismaService.user.create({
      data: {
        id: ulid(),
        name: params.name,
        email: params.email,
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

  private async validateTokens(
    refreshToken: string,
  ): Promise<JwtRefreshPayload> {
    let refreshPayload: JwtRefreshPayload;

    try {
      refreshPayload = await this.jwtService.verifyAsync<JwtRefreshPayload>(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );
    } catch {
      throw ApiErrorResponse.unauthorized('토큰이 유효하지 않습니다.');
    }

    if (!refreshPayload.id)
      throw ApiErrorResponse.unauthorized('토큰 페이로드가 유효하지 않습니다.');

    return refreshPayload;
  }

  async refresh(
    refreshDto: RefreshDto,
  ): Promise<ApiSuccessResponse<RefreshResponse>> {
    const { refreshToken: oldRefreshToken } = refreshDto;
    if (!oldRefreshToken)
      throw ApiErrorResponse.badRequest('갱신 토큰이 없습니다.');

    const { id, deviceId } = await this.validateTokens(oldRefreshToken);

    const user: user | null = await this.prismaService.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!user) throw ApiErrorResponse.notFound('유저를 찾을 수 없습니다.');

    const tokens: LoginResponse = this.generateTokens(user, deviceId);
    const hashedRefreshToken = sha256(tokens.refreshToken);

    await this.prismaService.refresh_token.upsert({
      where: { userId_deviceId: { userId: id, deviceId } },
      create: {
        userId: id,
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
}
