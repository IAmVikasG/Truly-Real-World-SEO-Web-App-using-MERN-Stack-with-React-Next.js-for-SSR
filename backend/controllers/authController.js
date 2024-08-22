const User = require('../models/userModel'); // Import the User model
const shortId = require('shortid'); // Import the shortid library for generating unique usernames
const jwt = require('jsonwebtoken');
const responseHandler = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');
const { sendEmailWithNodemailer } = require('../helpers/email');


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
    return user.updateOne({ resetPasswordLink: token }, (err, success) =>
    {
        if (err)
        {
            return res.json({ error: errorHandler(err) });
        } else
        {
            sgMail.send(emailData).then(sent =>
            {
                return res.json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`
                });
            });
        }
    });
});

exports.forgotPassword = asyncHandler(async (req, res) =>
{
    const { email } = req.body;

    // Await the user retrieval
    const user = await User.findOne({ email }).exec();

    // Check if the user exists
    if (!user) return responseHandler(res, null, 'User with that email does not exist.', 404);

    // Create a token for password reset
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });

    // Prepare the email data
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Password reset link`,
        html: `
            <p>Please use the following link to reset your password:</p>
            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>https://seoblog.com</p>
        `
    };

    // Update the user's resetPasswordLink field
    try
    {
        await user.updateOne({ resetPasswordLink: token });

        // Send the email after successful update
        await sendEmailWithNodemailer(emailData);

        return responseHandler(res, null, `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`);
    } catch (err)
    {
        return responseHandler(res, null, err, 500);
    }
});


exports.resetPassword = asyncHandler(async (req, res) =>
{
    const { resetPasswordLink, newPassword } = req.body;

    if (!resetPasswordLink)
    {
        return responseHandler(res, null, 'Reset password link is required.', 400);
    }

    try
    {
        // Verify the reset password link (JWT)
        const decoded = jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD);

        // Find the user by reset password link
        const user = await User.findOne({ resetPasswordLink }).exec();

        // If no user is found
        if (!user)
        {
            return responseHandler(res, null, 'Something went wrong. Try again later.', 401);
        }

        // Update the user's password and clear the resetPasswordLink
        user.password = newPassword;
        user.resetPasswordLink = '';

        // Save the updated user information
        await user.save();

        return responseHandler(res, null, 'Great! Now you can login with your new password.');

    } catch (err)
    {
        // Handle token expiration or any other errors
        if (err.name === 'TokenExpiredError')
        {
            return responseHandler(res, null, 'Expired link. Try again.', 401);
        }

        return responseHandler(res, null, 'Something went wrong. Try again later.', 500);
    }
});

