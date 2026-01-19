import { ApiError } from '@backend/modules/error/ApiError';
import type { NextFunction, Request, Response } from 'express';

import { normalizeZodError } from '../modules/error/normalizeZodError';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  const zodNormalized = normalizeZodError(err);
  if (zodNormalized) {
    const json = zodNormalized.toResponse();
    return res.status(zodNormalized.httpStatus).json(json);
  }

  if (err instanceof ApiError) {
    return res.status(err.httpStatus).json(err.toResponse());
  }

  const internal = new ApiError({
    message: 'Unexpected server error',
    code: 'INTERNAL_ERROR',
    httpStatus: 500,
    details: process.env.NODE_ENV === 'development' ? err : undefined,
  });

  return res.status(500).json(internal.toResponse());
};
