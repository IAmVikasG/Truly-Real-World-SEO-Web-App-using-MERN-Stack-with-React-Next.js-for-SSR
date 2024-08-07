const User = require('../models/userModel'); // Import the User model

exports.read = (req, res) =>
{
    req.profile.hashed_password = undefined;
    req.profile.resetPasswordLink = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};
