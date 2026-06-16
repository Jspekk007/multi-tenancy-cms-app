export class ApiError extends Error {
    code;
    httpStatus;
    details;
    correlationId;
    cause;
    constructor(input) {
        super(input.message);
        this.code = input.code;
        this.httpStatus = input.httpStatus;
        this.details = input.details;
        this.correlationId = input.correlationId;
        this.cause = input.cause;
    }
    toResponse() {
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
//# sourceMappingURL=ApiError.js.map