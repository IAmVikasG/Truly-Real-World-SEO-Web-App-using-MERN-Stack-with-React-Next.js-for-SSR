const User = require('../models/userModel'); // Import the User model
const responseHandler = require('../utils/responseHandler');


exports.authMiddleware = async (req, res, next) =>
{
    const userId = req.auth._id;
    const existingUser = await User.findById({ _id: userId }).exec();
    if (!existingUser)
    {
        return responseHandler(res, null, 'User not found.', 400);
    }
    req.profile = existingUser;
    next();
};
