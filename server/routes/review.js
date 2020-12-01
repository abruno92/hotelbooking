/**
 * This file contains the configuration of an Express.js router
 * for the '/review' route.
 */
const express = require("express");
const config = require("../config");
const {axiosJwtCookie} = require("../utils");
const {isCurrentUser} = require("../middleware/inputParsing");
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
    parseObjectId('userId', async (value) => await userDb.existsById(value))
        // check that the authenticated user is the one making the post request
        .custom(isCurrentUser),
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
            review = (await axiosJwtCookie(req).get(`review`)).data
                .filter(review => review.userId === req.body.userId && review.roomId === req.body.roomId);
        } catch (e) {
            if (!e.response) {
                console.log(e);
                return res.sendStatus(500);
            } else if (e.response.status !== 404) {
                console.log(e.response);
                return res.status(e.response.status).send({error: e.response.data});
            }

            console.log(e);
            return res.sendStatus(500);
        }

        if (review.length === 0) {
            return next();
        } else {
            const message = `a review already exists for this room by this user`;
            console.log(message);
            return res.status(409).send({error: message});
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
    parseObjectId('id', async (value) => await reviewDb.existsById(value))
        .custom(checkCurrentUser),
    // 'content' body attribute
    parseString('content', {min: 10, max: 1000}, true),
    // validate above attributes
    inputValidator,
    // handle update
    updateHandler(reviewDb, "content"));

// delete
router.delete('/:id',
    authGuard(config.db.privileges.userLow),
    // 'id' URL param
    parseObjectId('id', async (value) => await reviewDb.existsById(value))
        .custom(checkCurrentUser),
    // handle delete
    deleteHandler(reviewDb));

module.exports = router;

/**
 * Checks if the currently authenticated user is the owner of the review.
 * @param reviewId - Id of the review to check
 * @param req - The Request object
 * @param res - The Response object
 * @returns {Error|boolean} True if the user owns the review, throws Error otherwise (see {@link isCurrentUser})
 */
async function checkCurrentUser(reviewId, {req, res}) {
    let review;
    try {
        review = (await axiosJwtCookie(req).get(`review/${reviewId}`, {withCredentials: true})).data;
    } catch (e) {
        if (!e.response) {
            console.log(e);
            return res.sendStatus(500);
        }

        return new Error("error occurred");
    }

    return isCurrentUser(review.userId, {req});
}