import { ApiProperty } from '@nestjs/swagger';

export class ApiSuccessResponse<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty()
  data: T;

  @ApiProperty({ example: '2026-04-10T08:20:09.676Z' })
  timestamp: string;

  private constructor(data: T, message: string) {
    this.statusCode = 200;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static of<T>(data: T, message = 'Success'): ApiSuccessResponse<T> {
    return new ApiSuccessResponse(data, message);
  }
}

export class ApiErrorResponse {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  message: string;

  @ApiProperty()
  timestamp: string;

  private constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }

  static of(statusCode: number, message: string): ApiErrorResponse {
    return new ApiErrorResponse(statusCode, message);
  }

  static badRequest(message = 'Bad Request'): ApiErrorResponse {
    return new ApiErrorResponse(400, message);
  }

  static unauthorized(message = 'Unauthorized'): ApiErrorResponse {
    return new ApiErrorResponse(401, message);
  }

  static forbidden(message = 'Forbidden'): ApiErrorResponse {
    return new ApiErrorResponse(403, message);
  }

  static notFound(message = 'Not Found'): ApiErrorResponse {
    return new ApiErrorResponse(404, message);
  }

  static conflict(message = 'Conflict'): ApiErrorResponse {
    return new ApiErrorResponse(409, message);
  }

  static internalServerError(message = 'Internal Server Error'): ApiErrorResponse {
    return new ApiErrorResponse(500, message);
  }
}