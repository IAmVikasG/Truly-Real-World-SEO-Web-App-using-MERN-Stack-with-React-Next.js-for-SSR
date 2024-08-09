const User = require('../models/userModel'); // Import the User model
const responseHandler = require('../utils/responseHandler');

exports.adminMiddleware = async (req, res, next) =>
{
    const userId = req.auth._id;
    const existingUser = await User.findById({ _id: userId }).exec();
    if (!existingUser)
    {
        return responseHandler(res, null, 'User not found.', 400);
    }
    if (existingUser.role !== 1)
    {
        return responseHandler(res, null, 'Admin resource. Access denied!', 400);
    }
    req.profile = existingUser;
    next();
};
