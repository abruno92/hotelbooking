/**
 * This file contains the configuration of an Express.js router
 * for the '/room' route.
 */
const express = require("express");
const router = express.Router();

router.use('/', (req, res) => {
    res.sendStatus(501);
});

module.exports = router;