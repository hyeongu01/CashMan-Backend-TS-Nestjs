import { Module } from '@nestjs/common';
import { NaverApiService } from './naver-api.service';

@Module({
  providers: [NaverApiService],
  exports: [NaverApiService],
})
export class OAuthModule {}
