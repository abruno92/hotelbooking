/**
 * This file contains the configuration of an Express.js router
 * for the '/review' route.
 */
const express = require("express");
const {getParamIdValidation, getIdValidation, getStringValidation, inputValidator} = require("../middleware/inputValidation");
const {createHandler, readHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const {MongoDatabase} = require("../db/database");
const {reviewCol} = require("../db/config");
const {body} = require("express-validator");
const router = express.Router();

const db = new MongoDatabase(reviewCol);

// create
router.post('/',
    // 'userId' body attribute
    getIdValidation('userId'),
    // 'roomId' body attribute
    getIdValidation('roomId'),
    // 'content' body attribute
    getStringValidation('content', {min: 10, max: 1000}),
    // validate above attributes
    inputValidator,
    // handle create
    createHandler(db, "userId", "roomId", "content"));

// read
router.get('/:id',
    // 'id' URL param
    getParamIdValidation(),
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
    getParamIdValidation(),
    // 'userId' body attribute
    body('userId')
        // only run validation if 'userId' is provided
        .if(body('userId').exists())
        // check if is a valid ObjectId string
        .isMongoId().withMessage("must be a valid MongoDB ObjectId string"),
    // 'roomId' body attribute
    body('roomId')
        // only run validation if 'roomId' is provided
        .if(body('roomId').exists())
        // check if is a valid ObjectId string
        .isMongoId().withMessage("must be a valid MongoDB ObjectId string"),
    // 'content' body attribute
    body('content')
        // only run validation if 'content' is provided
        .if(body('content').exists())
        // ensure length is between 10 and 1000 characters
        .isLength({min: 10, max: 1000}).withMessage('must be between 10 and 1000 characters'),
    // validate above attributes
    inputValidator,
    // handle update
    updateHandler(db, "userId", "roomId", "content"));

// delete
router.delete('/:id',
    // 'id' URL param
    getParamIdValidation(),
    // handle delete
    deleteHandler(db));

module.exports = router;