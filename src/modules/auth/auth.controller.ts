import { Controller, Get, Query, Body, Post, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NaverCallbackDto } from './dto/naver-callback.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshResponse } from './response/refresh.response';
import { ApiWrappedResponse } from '@common/decorators/api-wrapped-response.decorator';
import { LoginResponse } from './response/login.response';
import { AuthUrlResponse } from '@modules/auth/response/auth-url.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/naver/login')
  @ApiOperation({ summary: '네이버 로그인 링크 생성' })
  @ApiWrappedResponse(AuthUrlResponse)
  getNaverLoginUrl(@Query('redirectUrl') redirectUrl: string) {
    return this.authService.generateNaverLoginUrl(redirectUrl);
  }

  @Get('/naver/callback')
  @ApiOperation({ summary: '네이버 콜백 API' })
  @ApiWrappedResponse(LoginResponse)
  @Redirect()
  async naverLogin(@Query() naverCallbackDto: NaverCallbackDto) {
    const tokens: LoginResponse =
      await this.authService.naverLogin(naverCallbackDto);
    const redirectBase = 'http://your';
    const params = new URLSearchParams({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: tokens.tokenType,
    });
    return { url: `${redirectBase}${params}`, statusCode: 302 };
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'accessToken 갱신' })
  @ApiWrappedResponse(RefreshResponse)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
