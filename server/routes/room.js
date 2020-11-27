/**
 * This file contains the configuration of an Express.js router
 * for the '/room' route.
 */
const express = require("express");
const {roomCol} = require("../db/config");
const {parseObjectId, parseString, inputValidator} = require("../middleware/inputParsing");
const {createHandler, readHandler, updateHandler, deleteHandler} = require("../middleware/restful");
const {MongoDatabase} = require("../db/database");
const {body} = require("express-validator");
const router = express.Router();

const db = new MongoDatabase(roomCol);

// create
router.post('/',
    // 'number' body attribute
    parseString('number', {min: 1, max: 3}),
    // 'floor' body attribute
    parseString('floor', {min: 1, max: 3}),
    // 'side' body attribute
    parseString('side', {min: 1, max: 3}),
    // 'category' body attribute
    parseString('category', {min: 1, max: 20}),
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
    parseObjectId('id', 'param'),
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
    parseObjectId('id', 'param'),
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
    parseObjectId('id', 'param'),
    // handle delete
    deleteHandler(db));

module.exports = router;