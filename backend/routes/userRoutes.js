const express = require('express');
const router = express.Router();
const { read, publicProfile, update, photo } = require('../controllers/userController');
const { requireSignin } = require('../middlewares/requireSigninMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

// validators
router.get('/user/profile', requireSignin, authMiddleware, read);
router.get('/user/:username', publicProfile);
router.put('/user/update', requireSignin, authMiddleware, update);
router.get('/user/photo/:username', photo);

module.exports = router;
