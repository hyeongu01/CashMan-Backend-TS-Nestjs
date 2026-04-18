import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RefreshDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  refreshToken?: string;
}
