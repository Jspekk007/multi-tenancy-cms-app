interface ZodErrorField {
  message?: string;
}

interface ZodErrorData {
  formErrors?: {
    fieldErrors?: ZodErrorField[];
  };
  issues?: ZodErrorField[];
}

interface ErrorData {
  message?: string;
  code?: string;
  zodError?: ZodErrorData;
}

interface ErrorResponse {
  message?: string;
  data?: ErrorData;
}

interface TRPCErrorShape {
  message?: string;
  data?: ErrorData;
}

interface ErrorObject {
  json?: ErrorResponse;
  shape?: TRPCErrorShape;
  data?: ErrorData;
  message?: string;
  cause?: {
    message?: string;
  };
}

export function getErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object') {
    return 'Unexpected error';
  }

  const obj = err as Record<string, unknown>;
  const errObj: ErrorObject = {
    json: obj.json as ErrorResponse | undefined,
    shape: obj.shape as TRPCErrorShape | undefined,
    data: obj.data as ErrorData | undefined,
    message: typeof obj.message === 'string' ? obj.message : undefined,
    cause:
      obj.cause && typeof obj.cause === 'object' && 'message' in obj.cause
        ? (obj.cause as { message?: string })
        : undefined,
  };

  const zodError = errObj.data?.zodError;
  if (zodError) {
    const fieldErrors = zodError.formErrors?.fieldErrors ?? zodError.issues;
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      return fieldErrors[0].message ?? 'Validation error';
    }
  }

  if (errObj.json?.message && typeof errObj.json.message === 'string') {
    return errObj.json.message;
  }

  if (errObj.json?.data?.message && typeof errObj.json.data.message === 'string') {
    return errObj.json.data.message;
  }

  if (errObj.json?.data?.code) {
    const code = errObj.json.data.code;
    if (code === 'UNAUTHORIZED') {
      return 'Invalid email or password';
    }
    if (code === 'BAD_REQUEST') {
      return 'Invalid request. Please check your input.';
    }
    if (code === 'FORBIDDEN') {
      return 'You do not have permission to perform this action.';
    }
    if (code === 'NOT_FOUND') {
      return 'Resource not found.';
    }
    if (code === 'CONFLICT') {
      return 'A conflict occurred. Please try again.';
    }
  }

  if (errObj.shape?.message && typeof errObj.shape.message === 'string') {
    return errObj.shape.message;
  }

  if (errObj.shape?.data?.message && typeof errObj.shape.data.message === 'string') {
    return errObj.shape.data.message;
  }

  if (errObj.shape?.data?.code) {
    const code = errObj.shape.data.code;
    if (code === 'UNAUTHORIZED') {
      return 'Invalid email or password';
    }
    if (code === 'BAD_REQUEST') {
      return 'Invalid request. Please check your input.';
    }
    if (code === 'FORBIDDEN') {
      return 'You do not have permission to perform this action.';
    }
    if (code === 'NOT_FOUND') {
      return 'Resource not found.';
    }
    if (code === 'CONFLICT') {
      return 'A conflict occurred. Please try again.';
    }
  }

  const isTransformError =
    errObj.message?.includes('transform') ||
    errObj.message?.includes('Unable to transform') ||
    errObj.cause?.message?.includes('transform') ||
    errObj.cause?.message?.includes('Unable to transform');

  if (isTransformError) {
    return 'Invalid email or password';
  }

  if (errObj.cause?.message && typeof errObj.cause.message === 'string') {
    return errObj.cause.message;
  }

  if (typeof errObj.data?.message === 'string') {
    return errObj.data.message;
  }

  if (errObj.data?.code) {
    const code = errObj.data.code;
    if (code === 'UNAUTHORIZED') {
      return 'Invalid email or password';
    }
    if (code === 'BAD_REQUEST') {
      return 'Invalid request. Please check your input.';
    }
    if (code === 'FORBIDDEN') {
      return 'You do not have permission to perform this action.';
    }
    if (code === 'NOT_FOUND') {
      return 'Resource not found.';
    }
    if (code === 'CONFLICT') {
      return 'A conflict occurred. Please try again.';
    }
  }

  if (typeof errObj.message === 'string' && errObj.message) {
    return errObj.message;
  }

  return 'Unexpected error';
}
