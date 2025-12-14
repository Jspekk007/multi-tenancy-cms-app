import type { ErrorCode } from "./ErrorCodes";

export interface ApiErrorResponse {
  message: string;
  code: ErrorCode;
  status: number;
  details?: unknown;
  correlationId?: string;
  cause?: unknown;
}
