/**
 * This file contains the configuration of an Express.js router
 * for the '/reply' route.
 */
const express = require("express");
const {port} = require("../config");
const {parseObjectId, parseString, inputValidator} = require("../middleware/inputParsing");
const {createHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const {MongoDatabase} = require("../db/database");
const {replyCol} = require("../db/config");
const axios = require("axios");
const {ObjectId} = require("mongodb");
const router = express.Router({mergeParams: true});

const db = new MongoDatabase(replyCol);

// middleware to validate the 'reviewId' parameter
// and add it to the request body
router.use('/',
    parseObjectId('reviewId', false, 'param'),
    // validate above attribute
    inputValidator
);

// create
router.post('/',
    // 'userId' body attribute
    parseObjectId('userId'),
    // 'content' body attribute
    parseString('content', {min: 10, max: 1000}),
    // validate above attributes
    inputValidator,
    // check that another reply does not already exist for this review
    async (req, res, next) => {
        let reply;
        try {
            reply = (await axios.get(`http://localhost:${port}/review/${(req.params.reviewId)}/reply`)).data;
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
        console.log(reply);

        const message = `a reply already exists for this review`;
        console.log(message);
        return res.status(409).send({error: message});
    },
    // handle create
    createHandler(db, "userId", "reviewId", "content")
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
            reply = (await db.getAll()).find(reply => reviewId.equals(reply.reviewId));
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
    retrieveId,
    // 'id' URL param
    parseObjectId('id', false, 'param'),
    // 'userId' body attribute
    parseObjectId('userId'),
    // 'reviewId' body attribute
    parseObjectId('reviewId'),
    // 'content' body attribute
    parseString('content', {min: 10, max: 1000}, true),
    // validate above attributes
    inputValidator,
    // handle update
    updateHandler(db, "userId", "reviewId", "content")
);

// delete
router.delete(['/', '/:id'],
    // retrieve the reply id using review id and add it to req.params
    retrieveId,
    // 'id' URL param
    parseObjectId('id', false, 'param'),
    // handle delete
    deleteHandler(db)
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
            const reply = (await axios.get(`http://localhost:${port}/review/${req.params.reviewId}/reply`)).data;
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