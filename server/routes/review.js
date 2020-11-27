/**
 * This file contains the configuration of an Express.js router
 * for the '/review' route.
 */
const express = require("express");
const {parseObjectId, parseString, inputValidator} = require("../middleware/inputParsing");
const {createHandler, readHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const {MongoDatabase} = require("../db/database");
const {reviewCol} = require("../db/config");
const router = express.Router();

const db = new MongoDatabase(reviewCol);

// create
router.post('/',
    // 'userId' body attribute
    parseObjectId('userId'),
    // 'roomId' body attribute
    parseObjectId('roomId'),
    // 'content' body attribute
    parseString('content', {min: 10, max: 1000}),
    // validate above attributes
    inputValidator,
    // handle create
    createHandler(db, "userId", "roomId", "content"));

// read
router.get('/:id',
    // 'id' URL param
    parseObjectId('id', false, 'param'),
    // validate above attributes
    inputValidator,
    // handle read
    readHandler(db));

// read all
router.get('/',
    // handle read all
    readHandler(db));

// update
router.patch('/:id',
    // 'id' URL param
    parseObjectId('id', false, 'param'),
    // 'userId' body attribute
    parseObjectId('userId', true),
    // 'roomId' body attribute
    parseObjectId('roomId', true),
    // 'content' body attribute
    parseString('content', {min: 10, max: 1000}, true),
    // validate above attributes
    inputValidator,
    // handle update
    updateHandler(db, "userId", "roomId", "content"));

// delete
router.delete('/:id',
    // 'id' URL param
    parseObjectId('id', 'param'),
    // handle delete
    deleteHandler(db));

module.exports = router;