const express = require('express');
const router = express.Router();
const { create } = require('../controllers/categoryController');

// validators
const { runValidation } = require('../validators');
const { createCategoryValidator } = require('../validators/category');
const { requireSignin, adminMiddleware } = require('../controllers/authController');

router.post('/category-create', createCategoryValidator, runValidation, requireSignin, adminMiddleware, create);


module.exports = router;
