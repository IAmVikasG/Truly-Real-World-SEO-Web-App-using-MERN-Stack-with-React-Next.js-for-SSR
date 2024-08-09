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

exports.getAllCategories = asyncHandler(async (req, res) =>
{
    const categories = await Category.find({});
    return responseHandler(res, categories, 'Categories fetched successfully');
});
