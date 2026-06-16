const readable = {
    BAD_REQUEST: 'The data you entered is invalid.',
    UNAUTHORIZED: 'Incorrect email or password.',
    FORBIDDEN: 'You do not have access to this resource.',
    NOT_FOUND: 'This resource could not be found.',
    CONFLICT: 'A conflict occurred.',
    INTERNAL_ERROR: 'Something went wrong. Please try again later.',
};
export function mapApiError(err) {
    return readable[err.code] ?? 'Unexpected error occurred.';
}
//# sourceMappingURL=errorFactory.js.map