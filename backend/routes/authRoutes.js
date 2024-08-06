const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController');

// validators
const { runValidation } = require('../validators');
const { userSignupValidator } = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);

module.exports = router;
