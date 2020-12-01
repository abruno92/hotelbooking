/**
 * This file contains the configuration of an Express.js router
 * for the '/booking' route.
 */
const express = require("express");
const {parseObjectId, parseDecimal, parseDate, inputValidator} = require("../middleware/inputParsing");
const {createHandler, readHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const {bookingDb, userDb, roomDb} = require("../db/database");
const router = express.Router();

// create
router.post('/',
    // 'userId' body attribute
    parseObjectId('userId', async (value) => await userDb.existsById(value)),
    // 'roomId' body attribute
    parseObjectId('roomId', async (value) => await roomDb.existsById(value)),
    // 'number' body attribute
    parseDecimal('price'),
    // 'startDate' body attribute
    parseDate('startDate'),
    // 'endDate' body attribute
    parseDate('endDate'),
    // validate above attributes
    inputValidator,
    // handle create
    createHandler(bookingDb, "userId", "roomId", "price", "startDate", "endDate"));

// read
router.get('/:id',
    // 'id' URL param
    parseObjectId(),
    // validate above attributes
    inputValidator,
    // handle read
    readHandler(bookingDb));

// read all
router.get('/',
    // handle read all
    readHandler(bookingDb));

// update
router.patch('/:id',
    // 'id' URL param
    parseObjectId(),
    // 'userId' body attribute
    parseObjectId('userId', async (value) => await userDb.existsById(value), true),
    // 'roomId' body attribute
    parseObjectId('roomId', async (value) => await roomDb.existsById(value), true),
    // 'number' body attribute
    parseDecimal('price', true),
    // 'startDate' body attribute
    parseDate('startDate', true),
    // 'endDate' body attribute
    parseDate('endDate', true),
    // validate above attributes
    inputValidator,
    // handle update
    updateHandler(bookingDb, "userId", "roomId", "price", "startDate", "endDate"));

// delete
router.delete('/:id',
    // 'id' URL param
    parseObjectId(),
    // handle delete
    deleteHandler(bookingDb));

module.exports = router;