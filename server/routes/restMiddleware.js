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
        res.status(422).json({errors: errors.array()});
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
            console.log(`unable to insert item '${newItem}'`);
            console.log(e);
            return res.status(500).send(`unable to insert item '${newItem}'`);
        }

        let retrievedItem
        try {
            retrievedItem = await db.getOne(id);
        } catch (e) {
            console.log("unable to retrieve item");
            console.log(e);
            return res.status(500).send("unable to retrieve item");
        }

        res.status(201).json(retrievedItem);
    };
}

module.exports = {
    inputValidator: inputValidator,
    createHandler: createHandler,
}