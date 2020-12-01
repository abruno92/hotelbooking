/**
 * This file contains the configuration of an Express.js router
 * for the '/room' route.
 */
const express = require("express");
const config = require("../config");
const {authGuard, notImplemented} = require("../middleware/misc");
const {parseObjectId, parseString, parseUrl, inputValidator} = require("../middleware/inputParsing");
const {createHandler, readHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const {roomDb} = require("../db/database");
const router = express.Router();

router.use(authGuard(config.db.privileges.userAny));

// create
router.post('/',
    authGuard(config.db.privileges.userHigh),
    // 'number' body attribute
    parseString('number', {min: 1, max: 3}),
    // 'floor' body attribute
    parseString('floor', {min: 1, max: 3}),
    // 'side' body attribute
    parseString('side', {min: 1, max: 3}),
    // 'category' body attribute
    parseString('category', {min: 1, max: 20}),
    // 'pictureUrl' body attribute
    parseUrl('pictureUrl'),
    // validate above attributes
    inputValidator,
    // handle create
    createHandler(roomDb, "number", "floor", "side", "category", "pictureUrl"));

// read
router.get('/:id',
    // 'id' URL param
    parseObjectId(),
    // validate above attributes
    inputValidator,
    // handle read
    readHandler(roomDb));

// read all
router.get('/',
    // handle read all
    readHandler(roomDb));

// update
router.patch('/:id',
    authGuard(config.db.privileges.userHigh),
    // 'id' URL param
    parseObjectId(),
    // 'number' body attribute
    parseString('number', {min: 1, max: 3}, true),
    // 'floor' body attribute
    parseString('floor', {min: 1, max: 3}, true),
    // 'side' body attribute
    parseString('side', {min: 1, max: 3}, true),
    // 'category' body attribute
    parseString('category', {min: 1, max: 20}, true),
    // 'pictureUrl' body attribute
    parseUrl('pictureUrl', true),
    // validate above attributes
    inputValidator,
    // handle update
    updateHandler(roomDb, "number", "floor", "side", "category", "pictureUrl"));

// delete
router.delete('/:id',
    authGuard(config.db.privileges.userHigh),
    // 'id' URL param
    parseObjectId(),
    // handle delete
    deleteHandler(roomDb));

router.get('/:id/picture', notImplemented);
router.put('/:id/picture', notImplemented);
router.delete('/:id/picture', notImplemented);

module.exports = router;