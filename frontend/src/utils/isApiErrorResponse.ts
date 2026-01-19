import { ApiErrorResponse } from '@/types/error';

export const isApiErrorResponse = (err: unknown): err is ApiErrorResponse => {
  if (typeof err !== 'object' || err === null) return false;

  const e = err as any;
  return (
    typeof e.message === 'string' &&
    typeof e.code === 'string' &&
    (typeof e.status === 'number' || typeof e.httpStatus === 'number')
  );
};
