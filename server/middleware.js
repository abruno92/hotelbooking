/**
 * This file contains various middleware functions.
 */
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("./config");
const userDb = require("./db/users");

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
 * Application-level middleware function that creates
 * a 404 "Not Found" error if reached.
 * @param req - The Request object
 * @param res - The Response object
 * @param next - The middleware function callback argument
 */
function notFoundCreator(req, res, next) {
    next(createError(404));
}

/**
 * Error handling middleware function that prints
 * errors/exceptions on the web page.
 * @param err - The Error object
 * @param req - The Request object
 * @param res - The Response object
 * @param _ - Ignored
 */
function errorHandler(err, req, res, _) {
    console.error(err);

    res.status(err.status || 500);
    res.send(`<pre>${err.stack}</pre>`);
}

/**
 * Function that returns a router-level middleware function that restricts route access
 * to users of given privilegeLevel.
 * E.g. Users of privilegeLevel '1' won't get access to a route
 * of privilegeLevel '0' nor vice versa.
 * @param {string} privilegeLevel - The privilege level needed to access the route
 * @returns {function(Request, Response, function)} - The router-level middleware function
 */
function getAuthLevelMw(privilegeLevel) {
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

/**
 * Router-level middleware function that restricts access to non logged in visitors only.
 * @param req - The Request object
 * @param res - The Response object
 * @param next - The middleware function callback argument
 */
function requireNotAuth(req, res, next) {
    if (req.user === undefined) {
        // user is not signed in
        next();
    } else {
        // user is signed in
        // set HTTP status to 403 "Forbidden"
        res.status(403);
        if (req.user.privilegeLevel === '0') {
            // if user has privilegeLevel '0', redirect them to '/home'
            res.redirect('/home');
        } else if (req.user.privilegeLevel === '1') {
            // if user has privilegeLevel '0', redirect them to '/admin'
            res.redirect('/admin');
        }
    }
}

module.exports = {
    parseJwtToken: parseJwtToken,
    notFoundCreator: notFoundCreator,
    errorHandler: errorHandler,
    getAuthLevelMw: getAuthLevelMw,
    requireNotAuth: requireNotAuth
};