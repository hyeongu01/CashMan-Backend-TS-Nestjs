import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NaverCallbackDto } from './dto/naver-callback.dto';
import { ApiOperation } from '@nestjs/swagger';

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
  naverLogin(@Query() naverCallbackDto: NaverCallbackDto) {
    return this.authService.naverLogin(naverCallbackDto);
  }
}
