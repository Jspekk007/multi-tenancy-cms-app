export interface ApiErrorResponse {
  message: string;
  code: string;
  status: number;
  details?: unknown;
  correlationId?: string;
  cause?: unknown;
}

export class ApiError extends Error {
  public readonly code: string;
  public readonly httpStatus: number;
  public readonly details?: unknown;
  public readonly correlationId?: string;
  public readonly cause?: unknown;

  constructor({
    message,
    code,
    httpStatus,
    details,
    correlationId,
    cause,
  }: {
    message: string;
    code: string;
    httpStatus: number;
    details?: unknown;
    correlationId?: string;
    cause?: unknown;
  }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = details;
    this.correlationId = correlationId;
    this.cause = cause;
  }
}
