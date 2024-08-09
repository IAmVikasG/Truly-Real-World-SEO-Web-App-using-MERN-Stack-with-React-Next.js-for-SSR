const express = require('express');
const router = express.Router();
const { create, list, read, remove } = require('../controllers/categoryController');

// validators
const { runValidation } = require('../validators');
const { createCategoryValidator } = require('../validators/category');
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { requireSignin } = require('../middlewares/requireSigninMiddleware');

router.post('/category-create', createCategoryValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.delete('/category/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;
