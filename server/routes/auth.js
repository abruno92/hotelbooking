/**
 * This file contains the configuration of an Express.js router
 * for the '/auth' route.
 */
const express = require("express");
const {body, check, validationResult} = require("express-validator");
const userDb = require("../db/users");
const jwt = require("jsonwebtoken");
const {jwtExpirySeconds} = require("../auth");
const {jwtSecret} = require("../config");

const router = express.Router();

/**
 * Validates default URL encoded form fields "email" and "password"
 * and attempts to log the user.
 */
router.post('/login',
    // validates email structure
    check('email').isEmail().withMessage('must follow the email structure'),
    // validates password length
    body('password').isLength({min: 5}).withMessage('must be at least 5 characters long'),
    (req, res) => {
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
            res.status(200).send("Login Successful");
        } else {
            // no matching user was found
            // set HTTP status to 403 "Forbidden"
            res.status(403);
            res.send('Wrong email or password');
        }
    });

/**
 * Will validate default URL encoded form fields for user creation
 * and attempt to create the user.
 * todo: implement
 */
router.post('/register', (req, res) => {
    res.sendStatus(501);
});

// refreshes jwt tokens
router.get('/refresh', function (req, res) {
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
                    return res.status(409).send("Token is more than 60 seconds away from expiry");
                }

                // generates a new token
                const newToken = jwt.sign({username: payload.username}, jwtSecret, {
                    algorithm: 'HS256',
                    expiresIn: jwtExpirySeconds
                });

                res.cookie('JwtToken', newToken, {maxAge: jwtExpirySeconds * 1000});
                res.status(200).send("Token Refresh Successful");
            } else {
                // token is expired
                console.log(err);
                res.sendStatus(401);
            }
        });
    } else {
        res.status(400).send("Missing JWT Token");
    }
});

module.exports = router;