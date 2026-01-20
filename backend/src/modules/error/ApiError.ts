import type { ApiErrorResponse } from "./ApiErrorResponse";
import { type ErrorCode } from "./ErrorCodes";

interface ApiErrorInput {
  message: string;
  code: ErrorCode;
  httpStatus: number;
  details?: unknown;
  correlationId?: string;
  cause?: unknown;
}

export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly httpStatus: number;
  public readonly details?: unknown;
  public readonly correlationId?: string;
  public readonly cause?: unknown;

  constructor(input: ApiErrorInput) {
    super(input.message);

    this.code = input.code;
    this.httpStatus = input.httpStatus;
    this.details = input.details;
    this.correlationId = input.correlationId;
    this.cause = input.cause;
  }

  toResponse(): ApiErrorResponse {
    return {
      message: this.message,
      code: this.code,
      status: this.httpStatus,
      details: this.details,
      correlationId: this.correlationId,
      cause: this.cause,
    };
  }
}
