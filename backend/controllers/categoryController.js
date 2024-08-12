const Category = require('../models/categoryModel');
const slugify = require('slugify');
const responseHandler = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');
const Blog = require('../models/blogModel');

exports.create = asyncHandler(async (req, res) =>
{
    const { name } = req.body;

    // Create the category
    const category = new Category({
        name,
        slug: slugify(name).toLowerCase(),
    });

    await category.save();
    return responseHandler(res, category, 'Category created successfully', 201);
});

exports.list = asyncHandler(async (req, res) =>
{
    const categories = await Category.find({});
    return responseHandler(res, categories, 'Categories fetched successfully');
});


exports.read = asyncHandler(async (req, res) =>
{
    const slug = req.params.slug.toLowerCase();

    const category = await Category.findOne({ slug }).exec();

    if (!category) return responseHandler(res, null, 'Category not found', 404);

    const blogs = await Blog.find({ categories: category })
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name')
        .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
        .exec();

    if (!blogs.length && !category.length)
    {
        return responseHandler(res, {}, 'No records found.', 404);
    }

    return responseHandler(res, {
        blogs: blogs || [],
        category: category || [],
        size: blogs.length
    }, 'Data fetched successfully.');
    
});

exports.remove = asyncHandler(async (req, res) =>
{
    const slug = req.params.slug.toLowerCase();

    const category = await Category.findOne({ slug }).exec();

    if (!category) return responseHandler(res, null, 'Category not found', 404);

    await category.deleteOne();

    return responseHandler(res, null, 'Category deleted successfully');
});
