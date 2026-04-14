import { Controller, Get, Query, Body, Redirect, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NaverCallbackDto } from './dto/naver-callback.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshResponse } from './response/refresh.response';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator';
import { LoginResponse } from './response/login.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/naver/login')
  @ApiOperation({ summary: '네이버 로그인 리다이렉트' })
  @Redirect()
  getNaverLoginUrl() {
    const url = this.authService.generateNaverLoginUrl();
    return { url };
  }

  @Get('/naver/callback')
  @ApiOperation({ summary: '네이버 콜백 API' })
  @ApiWrappedResponse(LoginResponse)
  naverLogin(@Query() naverCallbackDto: NaverCallbackDto) {
    return this.authService.naverLogin(naverCallbackDto);
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
