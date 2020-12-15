/**
 * This file contains the configuration of an Express.js router
 * for the '/auth' route.
 */
const express = require("express");
const config = require("../config");
const {userDb} = require("../db/database")
const {reviewDb} = require("../db/database");
const {readHandler} = require("../middleware/restful");
const {authGuard} = require("../middleware/misc");
const {parseObjectId, inputValidator} = require("../middleware/inputParsing");

const router = express.Router();

router.get('/reply/:id',
    authGuard(config.db.privileges.userAny),
    // 'id' URL param
    parseObjectId(),
    // validate above attributes
    inputValidator,
    // handle read
    readHandler(reviewDb),
);

router.get('/user/current',
    authGuard(config.db.privileges.userAny),
    // add current user id to req.params
    (req, _, next) => {
        req.params.id = req.user._id;
        next()
    },
    // handle read
    readHandler(userDb, user => {
        // remove passwordHash field
        delete user.passwordHash;
        return user;
    })
);

router.get('/user/:id',
    authGuard(config.db.privileges.userAny),
    // 'id' URL param
    parseObjectId(),//.custom(isCurrentUser),
    // validate above attribute
    inputValidator,
    // handle read
    readHandler(userDb, user => {
        // remove passwordHash field
        delete user.passwordHash;
        return user;
    })
);

module.exports = router;