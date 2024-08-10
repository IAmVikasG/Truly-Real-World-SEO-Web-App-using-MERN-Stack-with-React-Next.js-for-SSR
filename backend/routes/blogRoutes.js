const express = require('express');
const { create, list, listAllBlogsCategoriesTags, read, remove, update, photo, listRelated } = require('../controllers/blogController');
const router = express.Router();


const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { requireSignin } = require('../middlewares/requireSigninMiddleware');


router.post('/blog-create', requireSignin, adminMiddleware, create);
router.get('/blogs', list);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:slug', read);
router.get('/blog/photo/:slug', photo);
router.delete('/blog/:slug', requireSignin, adminMiddleware, remove);
router.put('/blog/:slug', requireSignin, adminMiddleware, update);
router.post('/blogs/related', listRelated);


module.exports = router;
