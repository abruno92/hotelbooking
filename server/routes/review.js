/**
 * This file contains the configuration of an Express.js router
 * for the '/review' route.
 */
const express = require("express");
const config = require("../config");
const axios = require('axios');
const {roomDb, userDb, reviewDb} = require("../db/database");
const {authGuard} = require("../middleware/misc");
const {parseObjectId, parseString, inputValidator} = require("../middleware/inputParsing");
const {createHandler, readHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const router = express.Router();

router.use(authGuard(config.db.privileges.userAny));

// create
router.post('/',
    authGuard(config.db.privileges.userLow),
    // 'userId' body attribute
    parseObjectId('userId', async (value) => await userDb.existsById(value)),
    // 'roomId' body attribute
    parseObjectId('roomId', async (value) => await roomDb.existsById(value)),
    // 'content' body attribute
    parseString('content', {min: 10, max: 1000}),
    // validate above attributes
    inputValidator,
    // check that another review does not already exist for this room by this user
    async (req, res, next) => {
        let review;
        try {
            review = (await axios.get(`https://localhost:${config.port}/review`)).data
                .filter(review => review.userId === req.body.userId && review.roomId === req.body.roomId);
            if (review.length === 0) {
                return next();
            } else {
                const message = `a review already exists for this room by this user`;
                console.log(message);
                return res.status(409).send({error: message});
            }
        } catch (e) {
            if (e.response.status !== 404) {
                console.log(e.response);
                return res.status(e.response.status).send({error: e.response.data});
            }

            console.log(e);
            return res.sendStatus(500);
        }
    },
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
    authGuard(config.db.privileges.userLow),
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
    authGuard(config.db.privileges.userHigh),
    // 'id' URL param
    parseObjectId(),
    // handle delete
    deleteHandler(reviewDb));

module.exports = router;