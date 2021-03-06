/**
 * This file contains the configuration of an Express.js router
 * for the '/auth' route.
 */
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");
const {authGuard} = require("../middleware/misc");
const {createHandler} = require("../middleware/restful");
const {userDb} = require("../db/database");
const {getHashedPassword} = require("../auth");
const {parseEmail, parsePassword, parseString, parseName, inputValidator} = require("../middleware/inputParsing");

const {expirySeconds, secret, cookieName} = config.jwt;

const router = express.Router();

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
    async (req, res) => {
        // gets email and password from request body
        const {email, password} = req.body;
        // checks credentials validity using the database
        const user = await userDb.validate(email, password);

        if (user) {
            // a matching user was found

            // signs JWT with the user's ObjectId as payload
            const token = jwt.sign({userId: user._id}, secret, {
                algorithm: 'HS256',
                expiresIn: expirySeconds
            });

            // todo maybe store JWT in session/localStorage instead of cookies
            res.cookie(config.jwt.cookieName, token, {maxAge: expirySeconds * 1000});
            res.json({message: "login successful", id: user._id});
        } else {
            // no matching user was found
            // set HTTP status to 401 "Unauthorised"
            res.status(401).json({error: 'Incorrect email or password'});
        }
    });

/**
 * Validates provided fields, ensures that another user with the same email
 * is not in the database, hashes the password and forwards the fields
 * to the RESTful createHandler.
 */
router.post('/register',
    // 'privilegeLevel' body attribute
    parseString('privilegeLevel', {min: 1, max: 50}, true)
        .custom(value => {
            const privileges = [config.db.privileges.customer, config.db.privileges.manager];
            const contains = privileges.includes(value);
            if (contains) {
                return true;
            } else {
                return new Error(`must be one of ${privileges.map(p => `'${p}'`).join(", ")}`);
            }
        }),
    // 'firstName' body attribute
    parseName('firstName'),
    // 'lastName' body attribute
    parseName('lastName'),
    // 'email' body attribute
    parseEmail()
        // ensure that email is not already in use
        .custom((email) => {
            return userDb.existsByEmail(email).then(exists => {
                return new Promise((resolve, reject) => {
                    if (exists) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            });
        })
        .withMessage("must not be already in use"),
    // 'password' body attribute
    parsePassword(),
    // 'confirmPassword' body attribute
    parsePassword('confirmPassword')
        .custom((input, {req}) => input === req.body['password'])
        .withMessage(`must match the Password field`),
    // validate above attributes
    inputValidator,
    // fill the rest of the database fields
    (req, res, next) => {
        if (!req.body.privilegeLevel) {
            req.body.privilegeLevel = config.db.privileges.customer;
        }
        req.body.passwordHash = getHashedPassword(req.body.password);
        next();
    },
    createHandler(userDb, user => {
        // remove passwordHash field
        delete user.passwordHash;
        return user;
    }, "privilegeLevel", "firstName", "lastName", "email", "passwordHash"));

/**
 * Refreshes the JWT token if it is less than 60 seconds
 * away from expiring.
 */
router.get('/refresh',
    authGuard(config.db.privileges.userAny),
    (req, res) => {
        const token = req.cookies[cookieName];

        let payload;
        try {
            // verifies the token
            payload = jwt.verify(token, secret);
        } catch (e) {
            // token is expired
            console.log(e);
            res.status(403).json({error: "token is expired"});
        }

        // current unix time in seconds
        const nowUnixSeconds = Math.round(Number(new Date()) / 1000);

        if (payload.exp - nowUnixSeconds > config.jwt.refreshThresholdSeconds) {
            // token is more than 60 seconds away from expiring
            return res.status(409).json({error: `token is more than ${(config.jwt.refreshThresholdSeconds)} seconds away from expiry`});
        }

        // generates a new token
        const newToken = jwt.sign({username: payload.username}, secret, {
            algorithm: 'HS256',
            expiresIn: expirySeconds
        });

        res.cookie(cookieName, newToken, {maxAge: expirySeconds * 1000});
        res.json({message: "token refreshed"});
    });

/**
 * Logs the user out by removing the JWT cookie.
 */
router.post('/logout',
    authGuard(config.db.privileges.userAny),
    (_, res) => {
        res.cookie(cookieName, '', {expires: new Date(0)});
        // res.clearCookie(jwtTokenCookie);
        res.sendStatus(204);
    })

module.exports = router;