/**
 * This file contains various middleware functions.
 */
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("./jwtSecret");
const userDb = require("./db/users");
const {validationResult} = require("express-validator");
const validator = require('express-validator'), ValidationChain = validator.ValidationChain;

/**
 * Function that returns a {@link ValidationChain} used to
 * validate (ensure is a valid {@link ObjectId} string) the 'field'
 * parameter in the request URL.
 * @param {string} field - Parameter to be validated, defaults to 'id'
 * @returns {function} - ValidationChain object
 */
function getParamIdValidation(field = 'id') {
    return getIdValidation(field, 'param');
}

/**
 * Function that returns a {@link ValidationChain} used to
 * validate (ensure is a valid {@link ObjectId} string) the 'field'
 * attribute in the given context object.
 * @param {string} context - Object in the request where the attribute is to be tested, defaults to 'body'
 * @param {string} field - Parameter to be validated, defaults to 'id'
 * @returns {function} - ValidationChain object
 */
function getIdValidation(field = 'id', context = 'body') {
    return validator[context](field)
        // ensure field is provided
        .exists().withMessage("must be provided").bail()
        // check if is a valid ObjectId string
        .isMongoId().withMessage("must be a valid MongoDB ObjectId string");
}

/**
 * Function that returns a {@link ValidationChain} used to
 * validate (ensure is a valid string that matches given boundaries) the 'field'
 * attribute in the given context object.
 * @param {string} field - Parameter to be validated, defaults to 'id'
 * @param {Object} options - Object of 'min' and 'max' to set the length of the string
 * @param {string} context - Object in the request where the attribute is to be tested, defaults to 'body'
 * @returns {function} - ValidationChain object
 */
function getStringValidation(field, options, context = 'body') {
    return validator[context](field)
        //ensure field is provided
        .exists().withMessage("must be provided").bail()
        //check if length matches
        .isLength(options).withMessage(`must be between ${options.min} and ${options.max} characters`);
}

/**
 * Router-level middleware function that check for input validation
 * errors in the request body/params.
 * @param req - The Request object
 * @param res - The Response object
 * @param next - The middleware function callback argument
 */
function inputValidator(req, res, next) {
    // check if errors have been generated during field validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // errors have been generated, send them in the response body
        res.status(400).json({errors: errors.array()});
    } else {
        // no errors, go to the next middleware
        next();
    }
}

/**
 * Application-level middleware function that extracts the
 * AuthToken cookie from the request object and adds
 * the {@link User} of that token to the request object.
 * @param req - The Request object
 * @param res - The Response object
 * @param next - The middleware function callback argument
 */
function parseJwtToken(req, res, next) {
    const token = req.cookies["JwtToken"];

    if (token) {
        jwt.verify(token, jwtSecret, (err, payload) => {
            if (!err) {
                req.user = userDb.getUser(payload.username);
            } else {
                console.log(err);
            }
            next();
        });
    } else {
        next();
    }
}

/**
 * Function that returns a router-level middleware function that restricts route access
 * to users of given privilegeLevel.
 * E.g. Users of privilegeLevel '1' won't get access to a route
 * of privilegeLevel '0' nor vice versa.
 * @param {string} privilegeLevel - The privilege level needed to access the route
 * @returns {function(Request, Response, function())} - The router-level middleware function
 */
function authGuard(privilegeLevel) {
    // Throw error if privilegeLevel is not of type "string"
    if (typeof privilegeLevel !== "string") throw new TypeError('"privilegeLevel" argument must be of type "string"');

    return (req, res, next) => {
        if (req.user) {
            // user is signed in
            if (req.user.privilegeLevel === privilegeLevel) {
                // user is of correct privilege
                next();
            } else {
                // user is of incorrect privilege
                // set HTTP status to 403 "Forbidden"
                res.status(403);
                res.redirect('/login');
            }
        } else {
            // user is not signed in
            // set HTTP status to 401 "Unauthorized"
            res.status(401);
            res.redirect('/login');
        }
    }
}

module.exports = {
    inputValidator: inputValidator,
    parseJwtToken: parseJwtToken,
    getAuthLevelMw: authGuard,
    getParamIdValidation: getParamIdValidation,
    getIdValidation: getIdValidation,
    getStringValidation: getStringValidation,
};