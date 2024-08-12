const Tag = require('../models/tagModel');
const slugify = require('slugify');
const responseHandler = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');
const Blog = require('../models/blogModel');


exports.create = asyncHandler(async (req, res) =>
{
    const { name } = req.body;

    // Create the Tag
    const tag = new Tag({
        name,
        slug: slugify(name).toLowerCase(),
    });

    await tag.save();
    return responseHandler(res, tag, 'Tag created successfully', 201);
});

exports.list = asyncHandler(async (req, res) =>
{
    const tags = await Tag.find({});
    return responseHandler(res, tags, 'Tags fetched successfully');
});


exports.read = asyncHandler(async (req, res) =>
{
    const slug = req.params.slug.toLowerCase();

    const tag = await Tag.findOne({ slug }).exec();

    if (!tag) return responseHandler(res, null, 'Tag not found', 404);

    const blogs = await Blog.find({ tags: tag })
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name')
        .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
        .exec();

    if (!blogs.length && !tag.length)
    {
        return responseHandler(res, {}, 'No records found.', 404);
    }

    return responseHandler(res, {
        blogs: blogs || [],
        tag: tag || [],
        size: blogs.length
    }, 'Data fetched successfully.');
});

exports.remove = asyncHandler(async (req, res) =>
{
    const slug = req.params.slug.toLowerCase();

    const tag = await Tag.findOne({ slug }).exec();

    if (!tag) return responseHandler(res, null, 'Tag not found', 404);

    await tag.deleteOne();

    return responseHandler(res, null, 'Tag deleted successfully');
});
