export function getErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object') {
    return 'Unexpected error';
  }

  // tRPC ClientError
  const anyErr = err as any;

  // 1. Zod validation errors
  const zodError = anyErr?.data?.zodError;
  if (zodError) {
    const fieldErrors = zodError.formErrors?.fieldErrors ?? zodError.issues;
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      return fieldErrors[0].message ?? 'Validation error';
    }
  }

  // 1.5. Check json property (raw error response) - this is where tRPC stores the error when transformation fails
  if (anyErr?.json?.message && typeof anyErr.json.message === 'string') {
    return anyErr.json.message;
  }

  // 1.6. Check json.data.message (nested in json)
  if (anyErr?.json?.data?.message && typeof anyErr.json.data.message === 'string') {
    return anyErr.json.data.message;
  }

  // 1.7. Check json.data.code for user-friendly messages
  if (anyErr?.json?.data?.code) {
    const code = anyErr.json.data.code;
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

  // 2. Check error shape first (tRPC error structure)
  // tRPC errors have shape.message or shape.data.message
  if (anyErr?.shape?.message && typeof anyErr.shape.message === 'string') {
    return anyErr.shape.message;
  }

  // 3. Check shape.data.message (nested error message)
  if (anyErr?.shape?.data?.message && typeof anyErr.shape.data.message === 'string') {
    return anyErr.shape.data.message;
  }

  // 4. Check shape.data.code and provide user-friendly message
  if (anyErr?.shape?.data?.code) {
    const code = anyErr.shape.data.code;
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

  // 5. Check if this is a transformation error FIRST - before checking cause.message
  // This prevents returning "Unable to transform response from server" to users
  const isTransformError =
    anyErr?.message?.includes('transform') ||
    anyErr?.message?.includes('Unable to transform') ||
    anyErr?.cause?.message?.includes('transform') ||
    anyErr?.cause?.message?.includes('Unable to transform');

  if (isTransformError) {
    // When superjson fails to transform error responses, provide a helpful message
    // For auth endpoints, this is typically an authentication error
    return 'Invalid email or password';
  }

  // 6. Check if there's a cause with the message (for wrapped errors)
  if (anyErr?.cause?.message && typeof anyErr.cause.message === 'string') {
    return anyErr.cause.message;
  }

  // 7. Our normalized server error in data.message
  if (typeof anyErr?.data?.message === 'string') {
    return anyErr.data.message;
  }

  // 8. Check data.code and provide a user-friendly message
  if (anyErr?.data?.code) {
    const code = anyErr.data.code;
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

  // 8. tRPC error message (check top-level)
  if (typeof anyErr?.message === 'string' && anyErr.message) {
    return anyErr.message;
  }

  // 9. Generic fallback
  return 'Unexpected error';
}
