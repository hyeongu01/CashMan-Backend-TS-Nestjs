import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.headers.authorization?.toLowerCase().startsWith('bearer '))
      throw new UnauthorizedException();
    const token = request.headers.authorization?.split(' ')[1];

    let payload: { id: string };
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.getItem(payload.id);
    if (!user) throw new UnauthorizedException();
    request['user'] = user;
    return true;
  }
}
