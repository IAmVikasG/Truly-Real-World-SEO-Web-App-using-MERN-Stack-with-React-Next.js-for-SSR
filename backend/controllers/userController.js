const User = require('../models/userModel'); // Import the User model
const asyncHandler = require('../utils/asyncHandler');
const responseHandler = require('../utils/responseHandler');
const Blog = require('../models/blogModel');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');


exports.read = (req, res) =>
{
    req.profile.hashed_password = undefined;
    req.profile.resetPasswordLink = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.publicProfile = asyncHandler(async (req, res) =>
{
    let username = req.params.username;
    let user;
    let blogs;

    const userFromDB = await User.findOne({ username }).exec();
    if (!userFromDB) return responseHandler(res, null, 'User not found', 404);

    user = userFromDB;
    let userId = user._id;
    blogs = await Blog.find({ postedBy: userId })
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name')
        .limit(10)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec();

    if (!blogs.length && !userFromDB)
    {
        return responseHandler(res, {}, 'No records found.', 404);
    }
    user.photo = undefined;
    user.hashed_password = undefined;
    return responseHandler(res, {
        blogs: blogs || [],
        user: user || [],
    }, 'Data fetched successfully.');
});

exports.update = asyncHandler(async (req, res) =>
{
    let form = new formidable.IncomingForm();
    // Set custom upload directory
    const uploadDir = path.join(__dirname, '../uploads/profile');

    // Ensure the directory exists
    if (!fs.existsSync(uploadDir))
    {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    form.keepExtensions = true;
    form.uploadDir = uploadDir; // Set the upload directory
    form.parse(req, async (err, fields, files) =>
    {
        if (err)
        {
            if (err) return responseHandler(res, {}, 'Image could not upload.', 400);

        }
        let user = req.profile;
        user = _.extend(user, fields);

        if (fields.password && fields.password.length < 6)
        {
            return responseHandler(res, {}, 'Password should be min 6 characters long', 422);
        }

        if (files.photo)
        {
            if (files.photo.size > 10000000)
            {
                return responseHandler(res, {}, 'Image should be less then 1mb in size', 400);
            }
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }
        let resp = await user.save();
        resp.hashed_password = undefined;
        resp.salt = undefined;
        resp.photo = undefined;
        return responseHandler(res, resp, 'Profile updated successfully.');

    });
});

exports.photo = asyncHandler(async (req, res) =>
{
    const username = req.params.username;
    const user = await User.findOne({ username }).exec();
    if(!user) return responseHandler(res, {}, 'No records found.', 404);
    if (user.photo.data)
    {
        res.set('Content-Type', user.photo.contentType);
        return res.send(user.photo.data);
    }
});
