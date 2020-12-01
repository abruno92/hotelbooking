/**
 * This file contains the configuration of an Express.js router
 * for the '/auth' route.
 */
const express = require("express");
const config = require("../config");
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

module.exports = router;