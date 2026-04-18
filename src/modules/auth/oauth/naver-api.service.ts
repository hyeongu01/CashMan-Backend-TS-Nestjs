import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OAuthProvider } from './oauth.interface';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { NaverCallbackDto } from '../dto/naver-callback.dto';
import { NaverProfileDto } from '../dto/naver-profile.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class NaverApiService implements OAuthProvider {
  constructor(private readonly configService: ConfigService) {}

  async getAccessToken(
    params: any,
  ): Promise<{ accessToken: string; tokenType: string }> {
    const naverCallbackDto: NaverCallbackDto = params as NaverCallbackDto;
    const result = await axios.get(
      'https://nid.naver.com/oauth2.0/token',
      {
      params: {
        grant_type: 'authorization_code',
        client_id: this.configService.get<string>('NAVER_CLIENT_ID'),
        client_secret: this.configService.get<string>('NAVER_CLIENT_SECRET'),
        redirect_uri: this.configService.get<string>('NAVER_REDIRECT_URI'),
        ...naverCallbackDto,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { access_token: accessToken, token_type: tokenType } = result.data;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { accessToken, tokenType };
  }

  async getProfile(
    tokenType: string,
    accessToken: string,
  ): Promise<LoginDto> {
    const result = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `${tokenType} ${accessToken}` },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const profile = plainToInstance(NaverProfileDto, result.data.response);
    await validateOrReject(profile);

    if (!profile.name)
      throw new InternalServerErrorException(
        '네이버 프로필에 이름이 없습니다.',
      );
    if (!profile.email)
      throw new InternalServerErrorException(
        '네이버 프로필에 이메일이 없습니다.',
      );

    return {
      provider: 'NAVER',
      providerId: profile.id,
      name: profile.name,
      email: profile.email,
      birthDate: ((): string | undefined => {
        const date = new Date(`${profile.birthyear}-${profile.birthday}`);
        return isNaN(date.getTime())
          ? undefined
          : date.toISOString().split('T')[0];
      })(),
    };
  }
}
