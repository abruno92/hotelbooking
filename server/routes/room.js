/**
 * This file contains the configuration of an Express.js router
 * for the '/room' route.
 */
const express = require("express");
const {roomCol} = require("../db/config");
const {parseObjectId, parseString, parseUrl, inputValidator} = require("../middleware/inputParsing");
const {createHandler, readHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const {MongoDatabase} = require("../db/database");
const router = express.Router();

const db = new MongoDatabase(roomCol);

// create
router.post('/',
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
    createHandler(db, "number", "floor", "side", "category", "pictureUrl"));

// read
router.get('/:id',
    // 'id' URL param
    parseObjectId(),
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
    updateHandler(db, "number", "floor", "side", "category", "pictureUrl"));

// delete
router.delete('/:id',
    // 'id' URL param
    parseObjectId(),
    // handle delete
    deleteHandler(db));

module.exports = router;