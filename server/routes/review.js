/**
 * This file contains the configuration of an Express.js router
 * for the '/review' route.
 */
const express = require("express");
const {roomDb} = require("../db/database");
const {userDb} = require("../db/database");
const {parseObjectId, parseString, inputValidator} = require("../middleware/inputParsing");
const {createHandler, readHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const {reviewDb} = require("../db/database");
const router = express.Router();

// create
router.post('/',
    // 'userId' body attribute
    parseObjectId('userId', async (value) => await userDb.existsById(value)),
    // 'roomId' body attribute
    parseObjectId('roomId', async (value) => await roomDb.existsById(value)),
    // 'content' body attribute
    parseString('content', {min: 10, max: 1000}),
    // validate above attributes
    inputValidator,
    // handle create
    createHandler(reviewDb, "userId", "roomId", "content"));

// read
router.get('/:id',
    // 'id' URL param
    parseObjectId(),
    // validate above attributes
    inputValidator,
    // handle read
    readHandler(reviewDb));

// read all
router.get('/',
    // handle read all
    readHandler(reviewDb));

// update
router.patch('/:id',
    // 'id' URL param
    parseObjectId(),
    // 'userId' body attribute
    parseObjectId('userId', async (value) => await userDb.existsById(value), true),
    // 'roomId' body attribute
    parseObjectId('roomId', async (value) => await roomDb.existsById(value), true),
    // 'content' body attribute
    parseString('content', {min: 10, max: 1000}, true),
    // validate above attributes
    inputValidator,
    // handle update
    updateHandler(reviewDb, "userId", "roomId", "content"));

// delete
router.delete('/:id',
    // 'id' URL param
    parseObjectId(),
    // handle delete
    deleteHandler(reviewDb));

module.exports = router;