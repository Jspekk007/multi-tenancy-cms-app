export const isApiErrorResponse = (err) => {
    if (typeof err !== 'object' || err === null)
        return false;
    const e = err;
    return (typeof e.message === 'string' &&
        typeof e.code === 'string' &&
        (typeof e.status === 'number' || typeof e.httpStatus === 'number'));
};
//# sourceMappingURL=isApiErrorResponse.js.map