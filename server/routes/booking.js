/**
 * This file contains the configuration of an Express.js router
 * for the '/booking' route.
 */
const express = require("express");
const {parseObjectId, parseDecimal, parseDate, inputValidator} = require("../middleware/inputParsing");
const {createHandler, readHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const {MongoDatabase} = require("../db/database");
const {bookingCol} = require("../db/config");
const router = express.Router();

const db = new MongoDatabase(bookingCol);

// create
router.post('/',
    // 'userId' body attribute
    parseObjectId('userId'),
    // 'roomId' body attribute
    parseObjectId('roomId'),
    // 'number' body attribute
    parseDecimal('price'),
    // 'startDate' body attribute
    parseDate('startDate'),
    // 'endDate' body attribute
    parseDate('endDate'),
    // validate above attributes
    inputValidator,
    // handle create
    createHandler(db, "userId", "roomId", "price", "startDate", "endDate"));

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
    // 'number' body attribute
    parseDecimal('price', true),
    // 'startDate' body attribute
    parseDate('startDate', true),
    // 'endDate' body attribute
    parseDate('endDate', true),
    // validate above attributes
    inputValidator,
    // handle update
    updateHandler(db, "userId", "roomId", "price", "startDate", "endDate"));

// delete
router.delete('/:id',
    // 'id' URL param
    parseObjectId('id', false, 'param'),
    // handle delete
    deleteHandler(db));

module.exports = router;