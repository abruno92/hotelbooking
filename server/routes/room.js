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
const {axiosJwtCookie} = require("../utils");
const router = express.Router();

router.use(authGuard(config.db.privileges.userAny));

// create
router.post('/',
    authGuard(config.db.privileges.manager),
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

// read not booked
router.get('/',
    // handle read not booked
    async (req, res) => {

        // get all bookings
        let allBookings;
        try {
            allBookings = (await axiosJwtCookie(req).get(`booking`)).data;
        } catch (e) {
            if (!e.response) {
                console.log(e);
                return res.sendStatus(500);
            }
        }

        // filter only bookings that are past their end date
        const currentDate = new Date();
        const currentlyBookedRooms = allBookings.filter(booking => booking.endDate <= currentDate)
            .map(booking => booking.roomId);

        // get all rooms
        let allRooms;
        try {
            allRooms = (await axiosJwtCookie(req).get(`room/all`)).data;
        } catch (e) {
            if (!e.response) {
                console.log(e);
                return res.sendStatus(500);
            }
        }

        //filter only rooms that are not present in currently booked rooms
        const availableRooms = allRooms.filter(room => !currentlyBookedRooms.some(booking => booking.roomId.equals(room._id)))

        res.json(availableRooms);
    });

// read all
router.get('/all',
    // handle read all
    readHandler(roomDb));

// update
router.patch('/:id',
    authGuard(config.db.privileges.manager),
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
    authGuard(config.db.privileges.manager),
    // 'id' URL param
    parseObjectId(),
    // handle delete
    deleteHandler(roomDb));

router.get('/:id/picture', notImplemented);
router.put('/:id/picture', notImplemented);
router.delete('/:id/picture', notImplemented);

module.exports = router;