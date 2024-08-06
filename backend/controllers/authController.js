const User = require('../models/userModel'); // Import the User model
const shortId = require('shortid'); // Import the shortid library for generating unique usernames
const jwt = require('jsonwebtoken');
const { expressjwt: expressjwt } = require('express-jwt');

exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});

exports.signup = async (req, res) =>
{
    try
    {
        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email: req.body.email }).exec();
        if (existingUser)
        {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        // Extract name, email, and password from the request body
        const { name, email, password } = req.body;
        let username = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;

        // Create a new user with the extracted information
        let newUser = new User({ name, email, password, profile, username });

        // Save the new user to the database
        await newUser.save();

        // Respond with a success message
        res.json({
            message: 'Signup success! Please signin.'
        });
    } catch (err)
    {
        // Handle any errors that occur
        return res.status(400).json({
            error: err.message
        });
    }
};

exports.signin = async (req, res) =>
{
    const { email, password } = req.body;

    try
    {
        // Check if user exists
        const user = await User.findOne({ email: req.body.email }).exec();
        if (!user)
        {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup.'
            });
        }

        // Authenticate
        if (!user.authenticate(password))
        {
            return res.status(400).json({
                error: 'Email and password do not match.'
            });
        }

        // Generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Set the token as a cookie in the response
        res.cookie('token', token, { expiresIn: '1d' });

        // Extract user details and send in response
        const { _id, username, name, email, role } = user;
        return res.json({
            token,
            user: { _id, username, name, email, role }
        });
    } catch (err)
    {
        console.log(err);
        // Handle any errors that occur
        return res.status(400).json({
            error: err.message
        });
    }
};

exports.signout = (req, res) =>
{
    res.clearCookie('token');
    res.json({
        message: 'Signout success'
    });
};
