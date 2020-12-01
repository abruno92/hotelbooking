/**
 * This file contains the configuration of an Express.js router
 * for the '/auth' route.
 */
const express = require("express");
const config = require("../config");
const {authGuard, notImplemented} = require('../middleware/misc');
const router = express.Router();

router.use(authGuard(config.db.privileges.userHigh));

router.get('/:id/picture', notImplemented);
router.put('/:id/picture', notImplemented);
router.delete('/:id/picture', notImplemented);

module.exports = router;