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
const { smartTrim } = require('../helpers/blog');

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
        blog.excerpt = smartTrim(body, 320, ' ', ' ...');
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
            const result = await blog.save();
            await Blog.findByIdAndUpdate(result._id, { $push: { categories: arrayOfCategories, tags: arrayOfTags } }, { new: true });

            return responseHandler(res, result, 'Blog successfully created', 201);
        } catch (error)
        {
            return next(error);
        }

    });
});

exports.list = asyncHandler(async (req, res) =>
{
    const blogs = await Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec();

    if (!blogs) return responseHandler(res, null, 'No records found.', 404);

    return responseHandler(res, blogs, 'Blogs successfully fetched.');
});

exports.listAllBlogsCategoriesTags = asyncHandler(async (req, res) =>
{
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    // Fetch blogs, categories, and tags
    const [blogs, categories, tags] = await Promise.all([
        Blog.find({})
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username profile')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
            .exec(),
        Category.find({}).exec(),
        Tag.find({}).exec()
    ]);

    // Handle cases where data does not exist
    if (!blogs.length && !categories.length && !tags.length)
    {
        return responseHandler(res, {}, 'No records found.', 404);
    }

    return responseHandler(res, {
        blogs: blogs || [],
        categories: categories || [],
        tags: tags || [],
        size: blogs.length
    }, 'Data fetched successfully.');
});


exports.read = asyncHandler(async (req, res) =>
{
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOne({ slug })
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select("-photo")
        .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt')
        .exec();
    if (!blog) return responseHandler(res, {}, 'No records found.', 404);
    return responseHandler(res, blog, 'Blog fetched successfully.');
});

exports.remove = asyncHandler(async (req, res) =>
{
    const slug = req.params.slug.toLowerCase();

    const blog = await Blog.find({ slug }).exec();

    if (!blog) return responseHandler(res, {}, 'No records found.', 404);

    await Blog.deleteOne({ slug });

    return responseHandler(res, null, 'Blog deleted successfully.');
});

exports.update = asyncHandler(async (req, res, next) =>
{
    const slug = req.params.slug.toLowerCase();

    let oldBlog = await Blog.findOne({ slug }).exec();

    if (!oldBlog) return responseHandler(res, {}, 'No records found.', 404);

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

        let slugBeforeMerge = oldBlog.slug;
        oldBlog = _.merge(oldBlog, fields);
        oldBlog.slug = slugBeforeMerge;

        const { body, desc, categories, tags } = fields;

        if (body)
        {
            oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
            oldBlog.desc = stripHtml(body.substring(0, 160));
        }

        if (categories)
        {
            oldBlog.categories = categories.split(',');
        }

        if (tags)
        {
            oldBlog.tags = tags.split(',');
        }


        if (files.photo)
        {
            if (files.photo.size > 10000000)
            {
                return responseHandler(res, {}, 'Image should be less then 1mb in size', 400);
            }
            oldBlog.photo.data = fs.readFileSync(files.photo.path);
            oldBlog.photo.contentType = files.photo.type;
        }
        try
        {
            const result = await oldBlog.save();
            result.photo = undefined;
            return responseHandler(res, result, 'Blog successfully updated', 201);
        } catch (error)
        {
            return next(error);
        }

    });
});


exports.photo = asyncHandler(async (req, res) =>
{
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOne({ slug })
        .select('photo')
        .exec();
    if (!blog) return responseHandler(res, null, 'No record found.', 404);

    res.set('Content-Type', blog.photo.contentType);
    return res.send(blog.photo.data);
});
