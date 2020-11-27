/**
 * This file contains the configuration of an Express.js router
 * for the '/auth' route.
 */
const express = require("express");
const jwt = require("jsonwebtoken");
const {requireJwtToken} = require("../middleware/misc");
const {fieldsMatch} = require("../middleware/inputParsing");
const {createHandler} = require("../middleware/restful");
const {UserDatabase} = require("../db/database");
const {getHashedPassword} = require("../auth");
const {jwtExpirySeconds, jwtTokenCookie} = require("../config");
const {jwtSecret} = require("../jwtSecret");
const {parseEmail, parsePassword, parseName, inputValidator} = require("../middleware/inputParsing");

const router = express.Router();

const db = new UserDatabase();

/**
 * Validates 'email' and 'password' fields, searches the database
 * for matching credentials, generates a JWT Token containing
 * the ObjectId of that user and stores the token as a cookie.
 */
router.post('/login',
    // 'email' body attribute
    parseEmail(),
    // 'password' body attribute
    parsePassword(),
    // validate above attributes
    inputValidator,
    (req, res) => {
        // gets email and password from request body
        const {email, password} = req.body;
        // checks credentials validity using the database
        const user = db.validate(email, getHashedPassword(password));

        if (user) {
            // a matching user was found

            // signs JWT with the user's ObjectId as payload
            const token = jwt.sign({userId: user._id}, jwtSecret, {
                algorithm: 'HS256',
                expiresIn: jwtExpirySeconds
            });

            // todo maybe store JWT in session/localStorage instead of cookies
            res.cookie('JwtToken', token, {maxAge: jwtExpirySeconds * 1000});
            res.json({message: "login successful"});
        } else {
            // no matching user was found
            // set HTTP status to 401 "Unauthorised"
            res.status(401).json({error: 'wrong email or password'});
        }
    });

/**
 * Validates provided fields, ensures that another user with the same email
 * is not in the database, hashes the password and forwards the fields
 * to the RESTful createHandler.
 */
router.post('/register',
    // 'firstName' body attribute
    parseName('firstName'),
    // 'lastName' body attribute
    parseName('lastName'),
    // 'email' body attribute
    parseEmail()
        // ensure that email is not already in use
        .custom((email) => {
            return db.exists(email).then(exists => {
                return new Promise((resolve, reject) => {
                    if (exists) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            });
        }).withMessage("must not be already in use"),
    // 'password' body attribute
    parsePassword(),
    // 'confirmPassword' body attribute
    parsePassword('confirmPassword'),
    // match 'password' field against 'confirmPassword'
    fieldsMatch('password', 'confirmPassword'),
    // match 'confirmPassword' field against 'password'
    fieldsMatch('confirmPassword', 'password'),
    // validate above attributes
    inputValidator,
    // fill the rest of the database fields
    (req, res, next) => {
        req.body.privilegeLevel = "0";
        req.body.passwordHash = getHashedPassword(req.body.password);
        next();
    },
    createHandler(db, "privilegeLevel", "firstName", "lastName", "email", "passwordHash"));

/**
 * Refreshes the JWT token if it is less than 60 seconds
 * away from expiring.
 */
router.get('/refresh', (req, res) => {
    const token = req.cookies[jwtTokenCookie];

    let payload;
    try {
        // verifies the token
        payload = jwt.verify(token, jwtSecret);
    } catch (e) {
        // token is expired
        console.log(e);
        res.status(403).json({error: "token is expired"});
    }

    // current unix time in seconds
    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);

    if (payload.exp - nowUnixSeconds > 60) {
        // token is more than 60 seconds away from expiring
        return res.status(409).json({error: "token is more than 60 seconds away from expiry"});
    }

    // generates a new token
    const newToken = jwt.sign({username: payload.username}, jwtSecret, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds
    });

    res.cookie(jwtTokenCookie, newToken, {maxAge: jwtExpirySeconds * 1000});
    res.json({message: "token refreshed"});
});

router.get('/logout',
    requireJwtToken,
    (_, res) => {
        res.cookie(jwtTokenCookie, '', {expires: new Date(0)});
        // res.clearCookie(jwtTokenCookie);
        res.sendStatus(200);
    })

module.exports = router;