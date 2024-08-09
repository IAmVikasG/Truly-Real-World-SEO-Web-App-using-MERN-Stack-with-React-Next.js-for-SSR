const responseHandler = require('./responseHandler');

module.exports = (err, req, res, next) =>
{
    // Handle duplicate key error (MongoDB)
    if (err.code === 11000)
    {
        const field = Object.keys(err.keyValue)[0];
        return responseHandler(res, null, `Duplicate value for ${field}. Please use another value.`, 400);
    }

    // Handle JWT errors
    if (err.name === 'TokenExpiredError')
    {
        return responseHandler(res, null, 'Token has expired. Please log in again.', 401);
    }

    if (err.name === 'JsonWebTokenError')
    {
        return responseHandler(res, null, 'Invalid token. Please log in again.', 401);
    }

    // Handle UnauthorizedError (typically from express-jwt middleware)
    if (err.name === 'UnauthorizedError')
    {
        return responseHandler(res, null, 'You are not authorized to access this resource.', 401);
    }

    // Handle other errors
    return responseHandler(res, null, err.message || 'Internal Server Error', err.status || 500);
};
