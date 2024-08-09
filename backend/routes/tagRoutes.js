const express = require('express');
const router = express.Router();
const { create, list, read, remove } = require('../controllers/tagController');

// validators
const { runValidation } = require('../validators');
const { createTagValidator } = require('../validators/tag');
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { requireSignin } = require('../middlewares/requireSigninMiddleware');

router.post('/tag-create', createTagValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/tags', list);
router.get('/tag/:slug', read);
router.delete('/tag/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;
