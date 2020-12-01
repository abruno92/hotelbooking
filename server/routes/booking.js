/**
 * This file contains the configuration of an Express.js router
 * for the '/booking' route.
 */
const express = require("express");
const config = require("../config");
const {authGuard} = require("../middleware/misc");
const {parseObjectId, parseDecimal, parseDate, inputValidator, isCurrentUser} = require("../middleware/inputParsing");
const {createHandler, readHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const {bookingDb, userDb, roomDb} = require("../db/database");
const axios = require("axios");
const router = express.Router();

router.use(authGuard(config.db.privileges.userAny));

// create
router.post('/',
    authGuard(config.db.privileges.userLow),
    // 'userId' body attribute
    parseObjectId('userId', async (value) => await userDb.existsById(value))
        // check that the authenticated user is the one making the post request
        .custom(isCurrentUser),
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
    authGuard(config.db.privileges.userLow),
    // 'id' URL param
    parseObjectId('id', async (value) => await bookingDb.existsById(value))
        .custom(checkCurrentUser),
    // 'number' body attribute
    parseDecimal('price', true),
    // 'startDate' body attribute
    parseDate('startDate', true),
    // 'endDate' body attribute
    parseDate('endDate', true),
    // validate above attributes
    inputValidator,
    // handle update
    updateHandler(bookingDb, "price", "startDate", "endDate"));

// delete
router.delete('/:id',
    authGuard(config.db.privileges.userHigh),
    // 'id' URL param
    parseObjectId(),
    // handle delete
    deleteHandler(bookingDb));

module.exports = router;

async function checkCurrentUser(value, {req, res}) {
    let booking;
    try {
        booking = (await axios.get(`https://localhost:${config.port}/booking/${value}`)).data;
    } catch (e) {
        if (!e.response) {
            console.log(e);
            return res.sendStatus(500);
        }

        return new Error("error occurred");
    }

    return isCurrentUser(booking.userId, {req});
}