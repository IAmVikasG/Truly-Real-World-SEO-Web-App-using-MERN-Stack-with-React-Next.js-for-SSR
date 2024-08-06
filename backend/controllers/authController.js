const User = require('../models/userModel'); // Import the User model
const shortId = require('shortid'); // Import the shortid library for generating unique usernames

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
