/**
 * This file contains the configuration of an Express.js router
 * for the '/room' route.
 */
const express = require("express");
const {inputValidator} = require("../middleware");
const {roomCol} = require("../db/config");
const {createHandler, readHandler, updateHandler, deleteHandler, getParamIdValidation} = require("../restMiddleware");
const {MongoDatabase} = require("../db/database");
const {body} = require("express-validator");
const router = express.Router();

const db = new MongoDatabase(roomCol);

// create
router.post('/',
    // 'number' body attribute
    body('number')
        .exists().withMessage("must be provided").bail()
        .isLength({min: 1, max: 3}).withMessage('must be between 1 and 3 characters'),
    // 'floor' body attribute
    body('floor')
        .exists().withMessage("must be provided").bail()
        .isLength({min: 1, max: 3}).withMessage('must be between 1 and 3 characters'),
    // 'side' body attribute
    body('side')
        .exists().withMessage("must be provided").bail()
        .isLength({min: 1, max: 3}).withMessage('must be between 1 and 3 characters'),
    // 'category' body attribute
    body('category')
        .exists().withMessage("must be provided").bail()
        .isLength({min: 1, max: 20}).withMessage('must be between 1 and 20 characters'),
    // 'pictureUrl' body attribute
    body('pictureUrl')
        .exists().withMessage("must be provided").bail()
        // todo: either this or isDataURI() to validate it
        // .isURL().withMessage('must be a valid URL')
        .isLength({min: 1, max: 2000}).withMessage('must be between 1 and 2000 characters'),
    // validate above attributes
    inputValidator,
    // handle create
    createHandler(db, "number", "floor", "side", "category", "pictureUrl"));

// read
router.get('/:id',
    // 'id' URL param
    getParamIdValidation(),
    // validate above attributes
    inputValidator,
    // handle read
    readHandler(db, "id"));

// read all
router.get('/',
    // handle read all
    readHandler(db));

// update
router.patch('/:id',
    // 'id' URL param
    getParamIdValidation(),
    // 'number' body attribute
    body('number')
        .if(body('number').exists())
        .isLength({min: 1, max: 3}).withMessage('must be between 1 and 3 characters'),
    // 'floor' body attribute
    body('floor')
        .if(body('floor').exists())
        .isLength({min: 1, max: 3}).withMessage('must be between 1 and 3 characters'),
    // 'side' body attribute
    body('side')
        .if(body('side').exists())
        .isLength({min: 1, max: 3}).withMessage('must be between 1 and 3 characters'),
    // 'category' body attribute
    body('category')
        .if(body('category').exists())
        .isLength({min: 1, max: 20}).withMessage('must be between 1 and 20 characters'),
    // 'pictureUrl' body attribute
    body('pictureUrl')
        .if(body('pictureUrl').exists())
        // todo: either this or isDataURI() to validate it
        // .isURL().withMessage('must be a valid URL')
        .isLength({min: 10, max: 2000}).withMessage('must be between 10 and 1000 characters'),
    // validate above attributes
    inputValidator,
    // handle update
    updateHandler(db, "number", "floor", "side", "category", "pictureUrl"));

// delete
router.delete('/:id',
    // 'id' URL param
    getParamIdValidation(),
    // handle delete
    deleteHandler(db));

module.exports = router;