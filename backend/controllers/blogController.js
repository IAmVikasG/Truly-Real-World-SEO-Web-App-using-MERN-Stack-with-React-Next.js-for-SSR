const Blog = require('../models/blogModel'); // Import the Blog model to interact with blog-related data in the database
const Category = require('../models/categoryModel'); // Import the Category model to manage blog categories
const Tag = require('../models/tagModel'); // Import the Tag model to handle blog tags
const formidable = require('formidable'); // Import formidable to handle file uploads and form data
const slugify = require('slugify'); // Import slugify to create URL-friendly slugs from blog titles
const { stripHtml } = require("string-strip-html"); // Import string-strip-html to remove HTML tags from strings
const _ = require('lodash'); // Import lodash for utility functions like deep cloning and object manipulation
const fs = require('fs'); // Import Node.js file system module to work with file operations (e.g., reading, writing)
const responseHandler = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');
const path = require('path');

exports.create = asyncHandler(async (req, res, next) =>
{
    let form = new formidable.IncomingForm();
    // Set custom upload directory
    const uploadDir = path.join(__dirname, '../uploads');

    // Ensure the directory exists
    if (!fs.existsSync(uploadDir))
    {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.keepExtensions = true;
    form.uploadDir = uploadDir; // Set the upload directory
    form.parse(req, async (err, fields, files) =>
    {
        if (err) return responseHandler(res, {}, 'Image could not upload.', 400);

        const { title, body, categories, tags } = fields;

        if (!title || !title.length)
        {
            return responseHandler(res, {}, 'title is required', 422);
        }

        if (!body || body.length < 200)
        {
            return responseHandler(res, {}, 'Content is too short', 422);
        }

        if (!categories || categories.length === 0)
        {
            return responseHandler(res, {}, 'At least one category is required', 422);
        }

        if (!tags || tags.length === 0)
        {
            return responseHandler(res, {}, 'At least one tag is required', 422);
        }

        let blog = new Blog();
        blog.title = title;
        blog.body = body;
        blog.slug = slugify(title).toLowerCase();
        blog.mtitle = `${title} | ${process.env.APP_NAME}`;
        blog.mdesc = stripHtml(body.substring(0, 160)).result;
        blog.postedBy = req.auth._id;

        // categories and tags
        let arrayOfCategories = categories && categories.split(',');
        let arrayOfTags = tags && tags.split(',');

        if (files.photo)
        {
            if (files.photo.size > 10000000)
            {
                return responseHandler(res, {}, 'Image should be less then 1mb in size', 400);
            }
            blog.photo.data = fs.readFileSync(files.photo.path);
            blog.photo.contentType = files.photo.type;
        }
        try {
            const resp = await blog.save();
            return responseHandler(res, resp, 'Blog successfully created', 201);
        } catch (error)
        {
            return next(error);
        }

    });
});
