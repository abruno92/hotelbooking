/**
 * This file contains various middleware functions related to RESTful APIs.
 */

const {validationResult} = require('express-validator');

/**
 * Router-level middleware function that check for input validation
 * errors in the request body/params.
 * @param req - The Request object
 * @param res - The Response object
 * @param next - The middleware function callback argument
 */
function inputValidator(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
    } else {
        next();
    }
}

/** Function that returns a handler for a POST request
 * related to inserting items in a database.
 * @param {MongoDatabase} db - {@link MongoDatabase} instance to be used
 * @param {...string} bodyAttributes - Attributes expected in the request body
 * @returns {function(Request, Response): Promise} - Handler
 */
function createHandler(db, ...bodyAttributes) {
    return async (req, res) => {
        let id;
        const newItem = {};
        bodyAttributes.forEach(attribute => newItem[attribute] = req.body[attribute]);
        try {
            id = await db.create(newItem);
        } catch (e) {
            const message = `unable to insert item '${newItem}'`;
            console.log(message);
            console.log(e);
            return res.status(500).json({error: message});
        }

        let retrievedItem
        try {
            retrievedItem = await db.getOne(id);
        } catch (e) {
            const message = "unable to retrieve the new item";
            console.log(message);
            console.log(e);
            return res.status(500).json({error: message});
        }

        res.status(201).json(retrievedItem);
    };
}

/** Function that returns a handler for a GET request
 * related to retrieving one or more items in a database.
 * @param {MongoDatabase} db - {@link MongoDatabase} instance to be used
 * @param readOne - 'undefined' retrieves all items, anything else returns first matched item based on id
 * @returns {function(Request, Response): Promise} - Handler
 */
function readHandler(db, readOne) {
    return async (req, res) => {
        let result
        try {
            if (readOne) {
                result = await db.getOne(req.params.id);
            } else {
                result = await db.getAll();
            }
        } catch (e) {
            const message = "unable to retrieve item" + itemId ? "" : "s";
            console.log(message);
            console.log(e);
            return res.status(500).json({error: message});
        }

        if (!result) {
            return res.sendStatus(404);
        } else if (result.length === 0) {
            return res.sendStatus(404);
        }

        res.json(result);
    };
}

/** Function that returns a handler for a PATCH request
 * related to updating one or more fields of an item in a database.
 * @param {MongoDatabase} db - {@link MongoDatabase} instance to be used
 * @param {...string} bodyAttributes - Attributes expected in the request body
 * @returns {function(Request, Response): Promise} - Handler
 */
function updateHandler(db, ...bodyAttributes) {
    return async (req, res) => {
        let result
        const newItem = {};
        bodyAttributes.forEach(attribute => {
            if (req.body[attribute]) {
                newItem[attribute] = req.body[attribute];
            }
        });

        if (Object.entries(newItem).length === 0) {
            return res.status(400).json({error: "no attributes supplied"});
        }

        const id = req.params.id;

        let originalItem
        try {
            originalItem = await db.getOne(id);
        } catch (e) {
            const message = "unable to retrieve the original item";
            console.log(message);
            console.log(e);
            return res.status(500).json({error: message});
        }

        if (!originalItem) {
            const message = `item with id ${id} not found`;
            console.log(message);
            return res.status(404).json({error: message})
        }
        try {
            result = await db.updateOne(id, newItem);
        } catch (e) {
            const message = "unable to update item";
            console.log(message);
            console.log(e);
            return res.status(500).json({error: message});
        }

        if (!result) {
            const message = 'provided attributes match already existing ones';
            console.log(message);
            return res.status(409).json({error: message});
        }

        res.json(result);
    };
}

/**
 * Function that returns a handler for a DELETE request
 * related to deleting an item in a database.
 * @param {MongoDatabase} db - {@link MongoDatabase} instance to be used
 * @returns {function(Request, Response): Promise} - Handler
 */
function deleteHandler(db) {
    return async (req, res) => {
        let result
        try {
            result = await db.deleteOne(req.params.id);
        } catch (e) {
            const message = "unable to delete item";
            console.log(message);
            console.log(e);
            return res.status(500).json({error: message});
        }

        if (!result) {
            return res.sendStatus(404);
        }

        res.json(result);
    };
}

module.exports = {
    inputValidator: inputValidator,
    createHandler: createHandler,
    readHandler: readHandler,
    updateHandler: updateHandler,
    deleteHandler: deleteHandler,
}