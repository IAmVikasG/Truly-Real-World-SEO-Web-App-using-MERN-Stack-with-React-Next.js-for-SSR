const Category = require('../models/categoryModel');
const slugify = require('slugify');

exports.create = async (req, res) =>
{
    try
    {
        const { name } = req.body;

        // Check if the category already exists
        const existingCategory = await Category.findOne({ slug: slugify(name).toLowerCase() });
        if (existingCategory)
        {
            return res.status(400).json({
                error: 'Category with this name already exists',
            });
        }

        // Create the category
        const category = new Category({
            name,
            slug: slugify(name).toLowerCase(),
        });

        await category.save();
        return res.status(201).json(category);
    } catch (error)
    {
        console.error('Error creating category:', error); // Log the error for debugging
        return res.status(500).json({
            error: 'Server error, please try again later.',
        });
    }
};
