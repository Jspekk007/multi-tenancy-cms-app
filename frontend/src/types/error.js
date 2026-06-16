export class ApiError extends Error {
    code;
    httpStatus;
    details;
    correlationId;
    cause;
    constructor({ message, code, httpStatus, details, correlationId, cause, }) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.httpStatus = httpStatus;
        this.details = details;
        this.correlationId = correlationId;
        this.cause = cause;
    }
}
//# sourceMappingURL=error.js.map