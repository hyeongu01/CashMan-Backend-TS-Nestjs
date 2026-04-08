export class ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
  timestamp: string;

  private constructor(statusCode: number, message: string, data: T | null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse(200, message, data);
  }

  static error(statusCode: number, message: string): ApiResponse<null> {
    return new ApiResponse(statusCode, message, null);
  }

  static badRequest(message = 'Bad Request'): ApiResponse<null> {
    return new ApiResponse(400, message, null);
  }

  static unauthorized(message = 'Unauthorized'): ApiResponse<null> {
    return new ApiResponse(401, message, null);
  }

  static forbidden(message = 'Forbidden'): ApiResponse<null> {
    return new ApiResponse(403, message, null);
  }

  static notFound(message = 'Not Found'): ApiResponse<null> {
    return new ApiResponse(404, message, null);
  }

  static conflict(message = 'Conflict'): ApiResponse<null> {
    return new ApiResponse(409, message, null);
  }

  static internalServerError(
    message = 'Internal Server Error',
  ): ApiResponse<null> {
    return new ApiResponse(500, message, null);
  }
}
