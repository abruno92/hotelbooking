/**
 * This file contains the configuration of an Express.js router
 * for the '/' (root) route.
 */
const express = require("express");
const {body, check} = require("express-validator");
const {getAuthLevelMw, requireNotAuth} = require("./middleware");
const {simpleRedirect, userLogin, jwtRefresh, userRegister} = require("./handlers");

const router = express.Router();

// middleware to restrict access to non logged in clients
router.use('/login.html', requireNotAuth);
// middleware to restrict access to non logged in clients
router.use('/signup.html', requireNotAuth);
// middleware to restrict access to privilegeLevel '1'
router.use('/adminpage.html', getAuthLevelMw('1'));

// redirects clients visiting '/' to '/login.html'
router.get('/', simpleRedirect('/login'));
// redirects clients visiting '/login' to '/login.html'
router.get('/login', simpleRedirect('/login.html'));
// redirects clients visiting '/admin' to '/adminpage.html'
router.get('/admin', simpleRedirect('/adminpage.html'));
// refreshes jwt tokens
router.get('/refresh', jwtRefresh);

/**
 * Validates default URL encoded form fields "email" and "password"
 * and attempts to log the user using {@link userLogin}.
 */
router.post('/login',
    requireNotAuth,
    // validates email structure
    check('email').isEmail().withMessage('must follow the email structure'),
    // validates password length
    body('password').isLength({min: 5}).withMessage('must be at least 5 characters long'),
    userLogin);

/**
 * Will validate default URL encoded form fields for user creation
 * and attempt to create the user.
 * todo: implement
 */
router.post('/register', userRegister);

module.exports = router;