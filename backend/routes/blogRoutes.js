const express = require('express');
const { create } = require('../controllers/blogController');
const router = express.Router();


const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { requireSignin } = require('../middlewares/requireSigninMiddleware');


router.post('/blog-create', requireSignin, adminMiddleware, create);

module.exports = router;
