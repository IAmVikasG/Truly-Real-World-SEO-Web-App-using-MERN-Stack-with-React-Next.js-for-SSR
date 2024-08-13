const express = require('express');
const { create, list, listAllBlogsCategoriesTags, read, remove, update, photo, listRelated, listSearch, listByUser } = require('../controllers/blogController');
const router = express.Router();

const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { requireSignin } = require('../middlewares/requireSigninMiddleware');
const { canUpdateDeleteBlog } = require('../middlewares/canUpdateDeleteBlogMiddleware');


router.post('/blog-create', requireSignin, adminMiddleware, create);
router.get('/blogs', list);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:slug', read);
router.get('/blog/photo/:slug', photo);
router.delete('/blog/:slug', requireSignin, adminMiddleware, remove);
router.put('/blog/:slug', requireSignin, adminMiddleware, update);
router.post('/blogs/related', listRelated);
router.get('/blogs/search', listSearch);


router.post('/user/blog-create', requireSignin, authMiddleware, create);
router.delete('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, remove);
router.put('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, update);
router.get('/:username/blogs', listByUser);


module.exports = router;
