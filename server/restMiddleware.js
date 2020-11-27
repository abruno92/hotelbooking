/**
 * This file contains various middleware functions related to RESTful APIs.
 */

/**
 * Function that returns a handler for a POST request
 * related to inserting items in a database.
 * @param {MongoDatabase} db - {@link MongoDatabase} instance to be used
 * @param {...string} bodyAttributes - Attributes expected in the request body
 * @returns {function(Request, Response): Promise} - Handler
 */
function createHandler(db, ...bodyAttributes) {
    return async (req, res) => {
        const newItem = {};

        // loop through the provided list of attribute names and add their respective values
        // from the request body to the newItem object
        bodyAttributes.forEach(attribute => newItem[attribute] = req.body[attribute]);

        let id;
        try {
            // add the object to the database and retrieve its generated ObjectId
            id = await db.create(newItem);
        } catch (e) {
            const message = `unable to insert item '${newItem}'`;
            console.log(message);
            console.log(e);
            return res.status(500).json({error: message});
        }

        let retrievedItem
        try {
            // retrieve the generated item
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

/**
 * Function that returns a handler for a GET request
 * related to retrieving one or more items in a database.
 * If req.params.id is not supplied, the function retrieves
 * all items of that database.
 * @param {MongoDatabase} db - {@link MongoDatabase} instance to be used
 * @returns {function(Request, Response): Promise} - Handler
 */
function readHandler(db) {
    return async (req, res) => {
        const id = req.params.id;

        let result
        try {
            if (id) {
                result = await db.getOne(id);
            } else {
                result = await db.getAll();
            }
        } catch (e) {
            const message = "unable to retrieve item" + id ? "" : "s";
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

/**
 * Function that returns a handler for a PATCH request
 * related to updating one or more fields of an item in a database.
 * @param {MongoDatabase} db - {@link MongoDatabase} instance to be used
 * @param {...string} bodyAttributes - Attributes expected in the request body
 * @returns {function(Request, Response): Promise} - Handler
 */
function updateHandler(db, ...bodyAttributes) {
    return async (req, res) => {
        const newItem = {};

        // loop through the provided list of attribute names and add their respective values
        // from the request body to the newItem object, only if they are already defined in the
        // request body
        bodyAttributes.forEach(attribute => {
            if (req.body[attribute]) {
                newItem[attribute] = req.body[attribute];
            }
        });

        // check if any attributes have been added to newItem
        // if the request body had no relevant attributes, newItem will be empty
        if (Object.entries(newItem).length === 0) {
            return res.status(400).json({error: "no attributes supplied"});
        }

        const id = req.params.id;

        let originalItem
        try {
            // retrieve the original item
            originalItem = await db.getOne(id);
        } catch (e) {
            const message = "unable to retrieve the original item";
            console.log(message);
            console.log(e);
            return res.status(500).json({error: message});
        }

        if (!originalItem) {
            const message = `item with id '${id}' not found`;
            console.log(message);
            return res.status(404).json({error: message})
        }

        let result
        try {
            // update database with the new item attributes
            result = await db.updateOne(id, newItem);
        } catch (e) {
            const message = "unable to update item";
            console.log(message);
            console.log(e);
            return res.status(500).json({error: message});
        }

        if (result === null) {
            // attributes in newItem match the ones in the existing item
            const message = 'provided attributes match existing ones';
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
        let oldItem
        try {
            // delete item from the database
            oldItem = await db.deleteOne(req.params.id);
        } catch (e) {
            const message = "unable to delete item";
            console.log(message);
            console.log(e);
            return res.status(500).json({error: message});
        }

        if (!oldItem) {
            const message = `item with id '${id}' not found`;
            console.log(message);
            return res.status(404).json({error: message})
        }

        res.json(oldItem);
    };
}

module.exports = {
    createHandler: createHandler,
    readHandler: readHandler,
    updateHandler: updateHandler,
    deleteHandler: deleteHandler,
}