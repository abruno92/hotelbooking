/**
 * This file contains the configuration of an Express.js router
 * for the '/reply' route.
 */
const express = require("express");
const {db} = require("../config");
const {parseObjectId, parseString, inputValidator} = require("../middleware/inputParsing");
const {createHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const {axiosJwtCookie} = require("../utils");
const {isCurrentUser} = require("../middleware/inputParsing");
const {authGuard} = require("../middleware/misc");
const {userDb, reviewDb, replyDb} = require("../db/database");
const {ObjectId} = require("mongodb");
const router = express.Router({mergeParams: true});

// middleware to validate the 'reviewId' parameter
// and add it to the request body
router.use('/',
    authGuard(db.privileges.userAny),
    parseObjectId('reviewId', async (value) => await reviewDb.existsById(value)),
    // validate above attribute
    inputValidator
);

// create
router.post('/',
    authGuard(db.privileges.userHigh),
    // 'userId' body attribute
    parseObjectId('userId', async (value) => await userDb.existsById(value))
        // check that the authenticated user is the one making the post request
        .custom(isCurrentUser),
    // 'content' body attribute
    parseString('content', {min: 10, max: 1000}),
    // validate above attributes
    inputValidator,
    // check that another reply does not already exist for this review
    async (req, res, next) => {
        try {
            await axiosJwtCookie(req).get(`review/${(req.params.reviewId)}/reply`, {withCredentials: true});
        } catch (e) {
            if (!e.response) {
                console.log(e);
                return res.sendStatus(500);
            }

            if (e.response.status !== 404) {
                console.log(e.response);
                return res.status(e.response.status).send({error: e.response.data});
            }

            req.body.reviewId = req.params.reviewId;
            return next();
        }

        const message = `a reply already exists for this review`;
        console.log(message);
        return res.status(409).send({error: message});
    },
    // handle create
    createHandler(replyDb, "userId", "reviewId", "content")
);

// read
router.get('/*',
    // handle read
    async (req, res) => {
        // convert reviewId to ObjectId
        const reviewId = ObjectId(req.params.reviewId);
        let reply;
        try {
            // retrieve the reply using reviewId
            reply = (await replyDb.getAll()).find(reply => reviewId.equals(reply.reviewId));
        } catch (e) {
            if (e.response) {
                console.log(e.response);
                return res.status(e.response.status).send({error: e.response.data});
            }
            console.log(e);
            return res.sendStatus(500);
        }

        if (!reply) {
            return res.sendStatus(404);
        }

        res.json(reply);
    }
);

// update
router.patch(['/', '/:id'],
    authGuard(db.privileges.userHigh),
    // retrieve the reply id using review id and add it to req.params
    retrieveId,
    // 'id' URL param
    parseObjectId('id', async (value) => await reviewDb.existsById(value))
        .custom(checkCurrentUser),
    // 'content' body attribute
    parseString('content', {min: 10, max: 1000}, true),
    // validate above attributes
    inputValidator,
    // handle update
    updateHandler(replyDb, "content")
);

// delete
router.delete(['/', '/:id'],
    authGuard(db.privileges.userHigh),
    // retrieve the reply id using review id and add it to req.params
    retrieveId,
    // 'id' URL param
    parseObjectId('id', async (value) => await reviewDb.existsById(value))
        .custom(checkCurrentUser),
    // handle delete
    deleteHandler(replyDb)
);

module.exports = router;

/**
 * Retrieves the reply id using the review id and adds it to req.params.
 * @param req - The Request object
 * @param res - The Response object
 * @param next - The middleware function callback argument
 */
async function retrieveId(req, res, next) {
    // check if request parameters has the id attribute
    if (!req.params.id) {
        // retrieve the reply and add its 'id' to req.params
        try {
            const reply = (await axiosJwtCookie(req).get(`review/${req.params.reviewId}/reply`, {withCredentials: true})).data;
            req.params.id = reply._id;
        } catch (e) {
            if (e.response) {
                console.log(e.response);
                return res.status(e.response.status).send({error: e.response.data});
            }
            console.log(e);
            return res.sendStatus(500);
        }
    }
    next();
}

/**
 * Checks if the currently authenticated user is the owner of the reply.
 * @param replyId - Id of the reply to check
 * @param req - The Request object
 * @param res - The Response object
 * @returns {Error|boolean} True if the user owns the reply, throws Error otherwise (see {@link isCurrentUser})
 */
async function checkCurrentUser(replyId, {req, res}) {
    let reply;
    try {
        reply = (await axiosJwtCookie(req).get(`reply/${replyId}`, {withCredentials: true})).data;
    } catch (e) {
        if (!e.response) {
            console.log(e);
            return res.sendStatus(500);
        }

        return new Error("error occurred");
    }

    return isCurrentUser(reply.userId, {req});
}