import { LoginDto } from '../dto/login.dto';

export interface OAuthProvider {
  getAccessToken(
    params: any,
  ): Promise<{ accessToken: string; tokenType: string }>;
  getProfile(tokenType: string, accessToken: string): Promise<LoginDto>;
}
