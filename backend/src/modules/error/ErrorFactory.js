import { ApiError } from './ApiError';
export const ErrorFactory = {
    badRequest(message = 'Bad Request', details) {
        return new ApiError({
            message,
            code: 'BAD_REQUEST',
            httpStatus: 400,
            details,
        });
    },
    unauthorized(message = 'Unauthorized') {
        return new ApiError({
            message,
            code: 'UNAUTHORIZED',
            httpStatus: 401,
        });
    },
    forbidden(message = 'Forbidden') {
        return new ApiError({
            message,
            code: 'FORBIDDEN',
            httpStatus: 403,
        });
    },
    notFound(message = 'Not Found') {
        return new ApiError({
            message,
            code: 'NOT_FOUND',
            httpStatus: 404,
        });
    },
    conflict(message = 'Conflict') {
        return new ApiError({
            message,
            code: 'CONFLICT',
            httpStatus: 409,
        });
    },
    validation(details) {
        return new ApiError({
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            httpStatus: 422,
            details,
        });
    },
    internal(message = 'Internal server error', cause) {
        return new ApiError({
            message,
            code: 'INTERNAL_ERROR',
            httpStatus: 500,
            cause,
        });
    },
};
//# sourceMappingURL=ErrorFactory.js.map