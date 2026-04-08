import { IsNotEmpty, IsString } from 'class-validator';

export class NaverCallbackDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  state: string;
}
