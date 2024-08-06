const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin } = require('../controllers/authController');

// validators
const { runValidation } = require('../validators');
const { userSignupValidator, userSigninValidator } = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);

// Test route
router.get('/secret', requireSignin, (req, res) =>
{
    res.json({ message: 'You have to access to secret page.' });
})

module.exports = router;
