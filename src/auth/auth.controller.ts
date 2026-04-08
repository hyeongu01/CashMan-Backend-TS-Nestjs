import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NaverCallbackDto } from './dto/naver-callback.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/naver/login')
  @Redirect()
  getNaverLoginUrl() {
    const url = this.authService.generateNaverLoginUrl();
    return { url };
  }

  @Get('/naver/callback')
  naverLogin(@Query() naverCallbackDto: NaverCallbackDto) {
    return this.authService.naverLogin(naverCallbackDto);
  }
}
