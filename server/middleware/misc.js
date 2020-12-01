/**
 * This file contains various middleware functions.
 */
const jwt = require("jsonwebtoken");
const config = require("../config");
const {UserDatabase} = require("../db/database");

const tokenCookie = config.jwt.tokenCookie;
const secret = config.jwt.secret;

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
    const token = req.cookies[tokenCookie];

    if (!token) {
        return next();
    }

    let payload;
    try {
        payload = await jwt.verify(token, secret);
    } catch (e) {
        console.log(e);
        return next();
    }

    req.user = await userDb.getOne(payload.userId);

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
        const {user} = req;
        if (user) {
            // user is signed in
            if (privilegeLevel === config.db.privileges.userAny ||
                user.privilegeLevel === privilegeLevel) {
                // user is of correct privilege or endpoint doesn't require specific privilege
                return next();
            } else {
                // user is of incorrect privilege
                // set HTTP status to 403 "Forbidden"
                res.status(403).json({error: "user has incorrect privilege"});
            }
        } else {
            // user is not signed in
            // set HTTP status to 401 "Unauthorized"
            res.status(401).json({error: "user is not authenticated"});
        }
    }
}

/**
 * Middleware function that responds with a
 * 501 "Not Implemented" status code.
 * @param req - The Request object
 * @param res - The Response object
 * @param next - The middleware function callback argument
 */
function notImplemented(req, res, next) {
    res.sendStatus(501);
}

module.exports = {
    parseJwtToken,
    authGuard,
    notImplemented,
};