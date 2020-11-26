/**
 * This file contains various middleware functions.
 */
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("./jwtSecret");
const userDb = require("./db/users");
const {validationResult} = require("express-validator");

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
    getAuthLevelMw: authGuard
};