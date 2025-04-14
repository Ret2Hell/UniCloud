import { HttpStatus } from '@nestjs/common';

export class ResponseUtil {
  /**
   * Format a successful response
   */
  static success<T>(
    message: string,
    data: T,
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    return {
      status: 'success',
      statusCode,
      message,
      data,
    };
  }

  /**
   * Format an error response
   */
  static error(message: string, statusCode: HttpStatus) {
    return {
      status: 'error',
      statusCode,
      message,
    };
  }
}
