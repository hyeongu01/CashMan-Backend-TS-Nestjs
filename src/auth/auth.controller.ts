import { Controller, Get, Query, Body, Redirect, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NaverCallbackDto } from './dto/naver-callback.dto';
import { ApiOperation } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshResponse } from './dto/refresh-response.dto';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator';
import { LoginResponseDto } from './dto/login-response.dto';

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
  @ApiWrappedResponse(LoginResponseDto)
  naverLogin(@Query() naverCallbackDto: NaverCallbackDto) {
    return this.authService.naverLogin(naverCallbackDto);
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'accessToken 갱신' })
  @ApiWrappedResponse(RefreshResponse)
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
