/**
 * This file contains the configuration of an Express.js router
 * for the '/room' route.
 */
const express = require("express");
const config = require("../config");
const {authGuard, notImplemented} = require("../middleware/misc");
const {parseDecimal, parseObjectId, parseString, parseUrl, inputValidator} = require("../middleware/inputParsing");
const {createHandler, readHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const {roomDb} = require("../db/database");
const {axiosJwtCookie} = require("../utils");
const router = express.Router();

router.use(authGuard(config.db.privileges.userAny));

// create
router.post('/',
    authGuard(config.db.privileges.manager),
    // 'name' body attribute
    parseString('name', {min: 5, max: 40}),
    // 'price' body attribute
    parseDecimal('price'),
    // 'category' body attribute
    parseString('category', {min: 1, max: 20}),
    // 'category' body attribute
    parseString('description', {min: 1, max: 1000}),
    // 'pictureFile' body attribute
    parseUrl('pictureFile'),
    // validate above attributes
    inputValidator,
    // handle create
    createHandler(roomDb, "name", "price", "description", "category", "pictureFile"));

// read all
router.get('/all',
    // handle read all
    readHandler(roomDb));

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
        const bookedRoomIds = allBookings.filter(booking => Date.parse(booking.endDate) <= currentDate.getTime())
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
        const availableRooms = allRooms.filter(room => !bookedRoomIds.some(bookedRoomId => bookedRoomId === room._id))

        res.json(availableRooms);
    });

// update
router.patch('/:id',
    authGuard(config.db.privileges.manager),
    // 'id' URL param
    parseObjectId(),
    // 'name' body attribute
    parseString('name', {min: 5, max: 40}, true),
    // 'price' body attribute
    parseDecimal('price', true),
    // 'category' body attribute
    parseString('description', {min: 1, max: 1000}, true),
    // 'category' body attribute
    parseString('category', {min: 1, max: 20}, true),
    // 'pictureFile' body attribute
    parseUrl('pictureFile', true),
    // validate above attributes
    inputValidator,
    // handle update
    updateHandler(roomDb, "name", "price", "description", "category", "pictureFile"));

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