import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';
    let details: Record<string, unknown> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse();

      if (typeof exResponse === 'object' && exResponse !== null) {
        const obj = exResponse as Record<string, unknown>;
        message = (obj.message as string) || exception.message;
        code = (obj.code as string) || this.statusToCode(status);

        // Handle class-validator errors
        if (Array.isArray(obj.message)) {
          code = 'VALIDATION_ERROR';
          message = 'Invalid request';
          details = this.formatValidationErrors(obj.message as string[]);
        }

        if (obj.details) {
          details = obj.details as Record<string, unknown>;
        }
      } else {
        message = exResponse as string;
        code = this.statusToCode(status);
      }
    } else if (exception instanceof Error) {
      // Never leak internal errors in production
      if (process.env.NODE_ENV !== 'production') {
        message = exception.message;
      }
      console.error('[Unhandled Error]', exception);
    }

    response.status(status).json({
      error: {
        code,
        message,
        ...(details && { details }),
      },
    });
  }

  private statusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMIT_EXCEEDED',
    };
    return map[status] || 'INTERNAL_ERROR';
  }

  private formatValidationErrors(messages: string[]): Record<string, string> {
    const errors: Record<string, string> = {};
    messages.forEach((msg, i) => {
      errors[`field_${i}`] = msg;
    });
    return errors;
  }
}
