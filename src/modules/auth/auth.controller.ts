import {
  Controller,
  Get,
  Query,
  Body,
  Post,
  Redirect,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NaverCallbackDto } from './dto/naver-callback.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshResponse } from './response/refresh.response';
import { ApiWrappedResponse } from '@common/decorators/api-wrapped-response.decorator';
import { LoginResponse } from './response/login.response';
import { AuthUrlResponse } from '@modules/auth/response/auth-url.response';
import { type Response, type Request } from 'express';
import { REFRESH_TOKEN_EXPIRES_MS } from '@common/constants/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/naver/login')
  @ApiOperation({ summary: '네이버 로그인 링크 생성' })
  @ApiWrappedResponse(AuthUrlResponse)
  async getNaverLoginUrl(@Query('redirectUrl') redirectUrl: string) {
    return await this.authService.generateNaverLoginUrl(redirectUrl);
  }

  @Get('/naver/callback')
  @ApiOperation({ summary: '네이버 콜백 API' })
  @ApiWrappedResponse(LoginResponse)
  @Redirect()
  async naverLogin(
    @Query() naverCallbackDto: NaverCallbackDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tokens, redirectUrl } =
      await this.authService.naverLogin(naverCallbackDto);
    const params = new URLSearchParams({
      accessToken: tokens.accessToken,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      // TODO: https 설정이 완료되면 true 로 변경
      secure: false,
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_EXPIRES_MS,
    });
    return { url: `${redirectUrl}?${params}`, statusCode: 302 };
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'accessToken 갱신' })
  @ApiWrappedResponse(RefreshResponse)
  @ApiResponse({ status: 400, description: 'refreshToken 이 없습니다.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() refreshDto?: RefreshDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken: string | undefined =
      req.cookies?.refreshToken || refreshDto?.refreshToken;

    return this.authService.refresh({
      refreshToken,
    });
  }
}
