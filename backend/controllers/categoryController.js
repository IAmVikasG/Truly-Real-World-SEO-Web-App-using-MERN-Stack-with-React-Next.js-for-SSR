const Category = require('../models/categoryModel');
const slugify = require('slugify');
const responseHandler = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');

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

    return responseHandler(res, category, 'Category fetched successfully');
});

exports.remove = asyncHandler(async (req, res) =>
{
    const slug = req.params.slug.toLowerCase();

    const category = await Category.findOne({ slug }).exec();

    if (!category) return responseHandler(res, null, 'Category not found', 404);

    await category.deleteOne();
    
    return responseHandler(res, null, 'Category deleted successfully');
});
