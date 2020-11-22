/**
 * This file contains the configuration of an Express.js router
 * for the '/booking' route.
 */
const express = require("express");
const router = express.Router();

router.use('/', (req, res) => {
    res.sendStatus(501);
});

module.exports = router;