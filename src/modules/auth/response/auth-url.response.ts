import { ApiProperty } from '@nestjs/swagger';

export class AuthUrlResponse {
  @ApiProperty()
  url: string;
}
