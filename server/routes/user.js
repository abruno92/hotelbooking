/**
 * This file contains the configuration of an Express.js router
 * for the '/auth' route.
 */
const express = require("express");
const {parseObjectId, inputValidator} = require("../middleware/inputParsing");
const router = express.Router();
/**
 * Changes the profile picture of a user.
 * @todo implement
 */
router.patch('/profile-pic/:id',
    // return 501 for the moment
    (req, res) => {
        res.sendStatus(501);
    },
    // 'id' param attribute
    parseObjectId(),
    // 'picture' body content
    // todo
    // validate above attributes
    inputValidator
)

module.exports = router;