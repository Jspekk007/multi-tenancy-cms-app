import { ApiError } from '@/core/errors/ApiError';

export const ErrorFactory = {
  badRequest(message = 'Bad Request', details?: unknown): ApiError {
    return new ApiError({
      message,
      code: 'BAD_REQUEST',
      httpStatus: 400,
      details,
    });
  },

  unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError({
      message,
      code: 'UNAUTHORIZED',
      httpStatus: 401,
    });
  },

  forbidden(message = 'Forbidden'): ApiError {
    return new ApiError({
      message,
      code: 'FORBIDDEN',
      httpStatus: 403,
    });
  },

  notFound(message = 'Not Found'): ApiError {
    return new ApiError({
      message,
      code: 'NOT_FOUND',
      httpStatus: 404,
    });
  },

  conflict(message = 'Conflict'): ApiError {
    return new ApiError({
      message,
      code: 'CONFLICT',
      httpStatus: 409,
    });
  },

  validation(details: unknown): ApiError {
    return new ApiError({
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      httpStatus: 422,
      details,
    });
  },

  internal(message = 'Internal server error', cause?: unknown): ApiError {
    return new ApiError({
      message,
      code: 'INTERNAL_ERROR',
      httpStatus: 500,
      cause,
    });
  },
};
