module.exports = (res, data = null, message = 'Success', statusCode = 200) =>
{
    const success = statusCode >= 200 && statusCode < 300;

    const responseObj = {
        success,
        message,
    };

    if (data && success) responseObj.data = data;

    // Send the response
    return res.status(statusCode).json(responseObj);
};
