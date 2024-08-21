const User = require('../models/userModel'); // Import the User model
const shortId = require('shortid'); // Import the shortid library for generating unique usernames
const jwt = require('jsonwebtoken');
const responseHandler = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');


exports.signup = asyncHandler(async (req, res) =>
{
    // Extract name, email, and password from the request body
    const { name, email, password } = req.body;

    // Check if a user with the given email already exists
    await User.findOne({ email }).exec();

    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    // Create a new user with the extracted information
    let newUser = new User({ name, email, password, profile, username });

    // Save the new user to the database
    await newUser.save();

    // Respond with a success message
    return responseHandler(res, null, 'Signup success! Please signin.', 201);

});

exports.signin = asyncHandler(async (req, res) =>
{
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).exec();
    if (!user)
    {
        return responseHandler(res, null, 'User with that email does not exist. Please signup.', 400);
    }

    // Authenticate user
    if (!user.authenticate(password))
    {
        return responseHandler(res, null, 'Email and password do not match.', 400);
    }

    // Generate token and respond to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { expiresIn: '1d' });

    const { _id, username, name, role } = user;
    return responseHandler(res, { token, user: { _id, username, name, email, role } }, 'Signin successful', 200);
});

exports.signout = (req, res) =>
{
    res.clearCookie('token');
    res.json({
        message: 'Signout success'
    });
};

exports.forgotPassword = asyncHandler(async (req, res) =>
{
    const { email } = req.body;

    const user = User.findOne({ email }).exec();

    if (!user) return responseHandler(res, null, 'User with that email does not exist.', 404);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });

    // email
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Password reset link`,
        html: `
        <p>Please use the following link to reset your password:</p>
        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
        <hr />
        <p>This email may contain sensetive information</p>
        <p>https://seoblog.com</p>
    `
    };
    // populating the db > user > resetPasswordLink
    // return user.updateOne({ resetPasswordLink: token }, (err, success) =>
    // {
    //     if (err)
    //     {
    //         return res.json({ error: errorHandler(err) });
    //     } else
    //     {
    //         sgMail.send(emailData).then(sent =>
    //         {
    //             return res.json({
    //                 message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`
    //             });
    //         });
    //     }
    // });
});

exports.resetPassword = asyncHandler(async (req, res) =>
{
    //
});
