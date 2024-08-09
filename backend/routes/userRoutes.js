const express = require('express');
const router = express.Router();
const { read } = require('../controllers/userController');
const { requireSignin } = require('../middlewares/requireSigninMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// validators
router.get('/profile', requireSignin, authMiddleware, read);

module.exports = router;
