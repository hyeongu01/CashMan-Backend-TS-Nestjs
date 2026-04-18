import { user } from '@generated/prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ example: '10HDFDSF...' })
  id: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: 'abc123@gmail.com' })
  email: string;

  @ApiProperty({ example: 'Asia/Seoul' })
  timezone: string;

  @ApiProperty({ example: 'KRW' })
  currency: string;

  @ApiProperty({ example: '2000-01-01', nullable: true })
  birthDate: string | null;

  static from(user: user): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      timezone: user.timezone,
      currency: user.currency,
      birthDate: user.birthDate
        ? user.birthDate.toISOString().split('T')[0]
        : null,
    };
  }
}
