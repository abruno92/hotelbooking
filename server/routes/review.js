/**
 * This file contains the configuration of an Express.js router
 * for the '/review' route.
 */
const express = require("express");
const {inputValidator, createHandler, readHandler, updateHandler, deleteHandler} = require("./restMiddleware");
const {MongoDatabase} = require("../db/database");
const {reviewCol} = require("../db/config");
const {body, param} = require("express-validator");
const router = express.Router();

const db = new MongoDatabase(reviewCol);

function getParamIdValidation() {
    return param('id')
        .exists().withMessage("must be provided").bail()
        .isMongoId().withMessage("must be a valid MongoDB ObjectId string");
}

// create
router.post('/',
    body('userId')
        .exists().withMessage("must be provided").bail()
        .isMongoId().withMessage("must be a valid MongoDB ObjectId string"),
    body('content')
        .exists().withMessage("must be provided").bail()
        .isLength({min: 10, max: 1000}).withMessage('must be between 10 and 1000 characters'),
    inputValidator,
    createHandler(db, "userId", "content"));

// read
router.get('/:id',
    getParamIdValidation(),
    inputValidator,
    readHandler(db, "id"));

// read all
router.get('/', readHandler(db));

// update
router.patch('/:id',
    getParamIdValidation(),
    body('userId')
        .if(body('userId').exists())
        .isMongoId().withMessage("must be a valid MongoDB ObjectId string"),
    body('content')
        .if(body('content').exists())
        .isLength({min: 10, max: 1000}).withMessage('must be between 10 and 1000 characters'),
    updateHandler(db, "userId", "content"));

// delete
router.delete('/:id',
    getParamIdValidation(),
    deleteHandler(db));

module.exports = router;