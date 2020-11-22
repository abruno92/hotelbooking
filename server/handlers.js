/**
 * This file contains various route handlers.
 */
const {validationResult} = require("express-validator");
const userDb = require("./db/users");
const jwt = require("jsonwebtoken");
const {jwtExpirySeconds} = require("./auth");
const {jwtSecret} = require("./config");

/**
 * Provides a simple redirect handler toward the given destination.
 * @param destination - The redirect destination
 * @returns {function} - The redirect handler
 */
function simpleRedirect(destination) {
    if (typeof destination !== "string") throw new TypeError('"destination" argument must be of type "string"');

    return (req, res) => {
        res.redirect(destination);
    };
}

/**
 * Verifies form fields "email" and "password" for errors,
 * validates user credentials against the database
 * and creates a JWT cookie for the user.
 * @param req - The Request object
 * @param res - The Response object
 */
function userLogin(req, res) {
    // ensures no errors have occurred during field validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // sends errors as response, if any
        return res.status(400).json({errors: errors.array()});
    }

    // gets email and password from request body
    const {email, password} = req.body;
    // checks credentials validity using the database
    const user = userDb.getAndValidateUser(email, password);

    if (user) {
        // a matching user was found

        // signs JWT with the email as payload
        const token = jwt.sign({username: user.email}, jwtSecret, {
            algorithm: 'HS256',
            expiresIn: jwtExpirySeconds
        });

        // TODO: maybe store JWT in session/localStorage instead of cookies
        res.cookie('JwtToken', token, {maxAge: jwtExpirySeconds * 1000});
        res.redirect('/home');
    } else {
        // no matching user was found
        // set HTTP status to 403 "Forbidden"
        res.status(403);
        res.send('Wrong email or password');
    }
}

/**
 * Refreshes a JWT token that's less than 60 seconds
 * away from expiring.
 * @param req - The Request object
 * @param res - The Response object
 */
function jwtRefresh(req, res) {
    const token = req.cookies["JwtToken"];

    if (token) {
        // token was found in cookies

        // verifies the token
        jwt.verify(token, jwtSecret, (err, payload) => {
            if (!err) {
                // token is still valid

                // current unix time in seconds
                const nowUnixSeconds = Math.round(Number(new Date()) / 1000);

                if (payload.exp - nowUnixSeconds > 60) {
                    // token is more than 60 seconds away from expiring
                    return res.sendStatus(400);
                }

                // generates a new token
                const newToken = jwt.sign({username: payload.username}, jwtSecret, {
                    algorithm: 'HS256',
                    expiresIn: jwtExpirySeconds
                });

                res.cookie('JwtToken', newToken, {maxAge: jwtExpirySeconds * 1000});
                res.sendStatus(200);
            } else {
                // token is expired
                console.log(err);
                res.sendStatus(401);
            }
        });
    } else {
        res.sendStatus(400);
    }
}

/**
 * Will verify form fields for errors
 * and create the user.
 * todo: implement
 */
function userRegister(req, res) {
    res.sendStatus(501);
}

module.exports = {
    simpleRedirect: simpleRedirect,
    userLogin: userLogin,
    jwtRefresh: jwtRefresh,
    userRegister: userRegister
};