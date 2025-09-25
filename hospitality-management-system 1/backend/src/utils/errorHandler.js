// Custom error class for API errors
class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development error response
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // Production error response
    if (err.isOperational) {
        // Operational, trusted error: send message to client
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
};

// Async handler to remove try-catch boilerplate
export const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Error types
export const ErrorTypes = {
    VALIDATION_ERROR: 'ValidationError',
    AUTHENTICATION_ERROR: 'AuthenticationError',
    AUTHORIZATION_ERROR: 'AuthorizationError',
    NOT_FOUND_ERROR: 'NotFoundError',
    DUPLICATE_ERROR: 'DuplicateError',
    SERVER_ERROR: 'ServerError'
};

// Error messages
export const ErrorMessages = {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    NOT_FOUND: 'Resource not found',
    VALIDATION_FAILED: 'Validation failed',
    SERVER_ERROR: 'Internal server error'
};

export { APIError };