import { ZodError } from 'zod';
import { ApiError } from './ApiError';
import { ErrorCodes } from './ErrorCodes';
export const normalizeZodError = (err) => {
    if (err instanceof ZodError) {
        return new ApiError({
            message: 'Validation failed',
            code: ErrorCodes.BAD_REQUEST,
            httpStatus: 400,
            details: err.flatten(),
        });
    }
    return null;
};
//# sourceMappingURL=normalizeZodError.js.map