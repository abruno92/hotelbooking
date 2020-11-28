/**
 * This file contains various middleware functions.
 */
const jwt = require("jsonwebtoken");
const {jwtTokenCookie} = require("../config");
const {jwtSecret} = require("../jwtSecret");
const {UserDatabase} = require("../db/database");

const userDb = new UserDatabase();

/**
 * Application-level middleware function that extracts the
 * JWT Token cookie from the request object and adds
 * the {@link User} bearer of that token to the request object.
 * @param req - The Request object
 * @param res - The Response object
 * @param next - The middleware function callback argument
 */
async function parseJwtToken(req, res, next) {
    const token = req.cookies[jwtTokenCookie];

    if (!token) {
        return next();
    }

    let payload;
    try {
        payload = await jwt.verify(token, jwtSecret);
    } catch (e) {
        console.log(e);
        return next();
    }

    req.user = userDb.getOne(payload.userId);

    next();
}

/**
 * Function that returns a router-level middleware function that restricts route access
 * to users of given privilegeLevel.
 * E.g. Users of privilegeLevel '1' won't get access to a route
 * of privilegeLevel '0' nor vice versa.
 * @param {string} privilegeLevel - Privilege level needed to access the route
 * @returns {function} - The router-level middleware function
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

/**
 * Router-level middleware function that ensures a
 * JWT Token cookie is present in the request.
 * @param req - The Request object
 * @param res - The Response object
 * @param next - The middleware function callback argument
 */
function requireJwtToken(req, res, next) {
    const token = req.cookies[jwtTokenCookie];
    if (!token) {
        return res.status(401).json({error: "missing jwt token"});
    }

    next();
}

module.exports = {
    parseJwtToken: parseJwtToken,
    requireJwtToken: requireJwtToken,
    getAuthLevelMw: authGuard,
};