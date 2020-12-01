/**
 * This file contains database-related functions.
 */
const config = require("../config");
const {confirmPassword} = require("../auth");
const {MongoClient, ObjectId} = require('mongodb');

const connectionString = config.db.connectionString;
const name = config.db.name;
const user = config.db.columns.user;

class MongoDatabase {
    constructor(collectionName) {
        this._collectionName = collectionName;
    }

    /**
     * Inserts an item in the database.
     * @param item - Item to be inserted in database
     * @returns {Promise<ObjectId|undefined>} - Id of the new item or 'undefined' in case of errors
     */
    async create(item) {
        // create a MongoClient instance and connect to the database
        const client = await MongoClient.connect(connectionString);
        // get a reference to the collection of this MongoDatabase instance
        const collection = client.db(name).collection(this._collectionName);

        try {
            // insert the item in the database
            const writeResult = await collection.insertOne(item);
            // return the ObjectId of the new item
            return writeResult.insertedId;
        } catch (e) {
            console.log(e);
            // return 'undefined' if any error occurred
            return undefined;
        } finally {
            // close the client connection to the database
            await client.close();
        }
    }

    /**
     * Retrieves a single item from the database.
     * @param id - Id of the item to retrieve
     * @returns {Promise<*|undefined>} - Matching item; null if not found or 'undefined' in case of errors
     */
    async getOne(id) {
        const client = await MongoClient.connect(connectionString);
        const collection = client.db(name).collection(this._collectionName);

        try {
            // if a string id is given, convert it to ObjectId
            if (typeof id === "string") id = new ObjectId(id);

            // query object
            const query = {_id: id};

            return await collection.findOne(query);
        } catch (e) {
            console.log(e);
            return undefined;
        } finally {
            await client.close();
        }
    }

    /**
     * Retrieves all items from the database.
     * @returns {Promise<*|undefined>} - Matching item list or 'undefined' in case of errors
     */
    async getAll() {
        const client = await MongoClient.connect(connectionString);
        const collection = client.db(name).collection(this._collectionName);

        // ready mongodb cursor
        const cursor = collection.find();

        try {
            // convert cursor documents to array
            return await cursor.toArray();
        } catch (e) {
            console.log(e);
            return undefined;
        } finally {
            await client.close();
            // close cursor
            await cursor.close();
        }
    }

    /**
     * Updates a single item in the database.
     * @param id - Id of the item to update
     * @param item - Object with the new attributes of the item
     * @returns {Promise<*|null|undefined>} - Updated item; 'null' if no changes took place
     * or 'undefined' in case of other errors
     */
    async updateOne(id, item) {
        const client = await MongoClient.connect(connectionString);
        const collection = client.db(name).collection(this._collectionName);

        try {
            if (typeof id === "string") id = new ObjectId(id);

            const query = {_id: id};

            // document that specifies update actions for the existing object
            const updateDocument = {
                $set: item
            };

            const result = await collection.updateOne(query, updateDocument);
            // check if any documents have been modified
            if (result.result.nModified === 1) {
                // one document has been updated, return it
                return this.getOne(id);
            } else {
                // no documents updated, return 'null'
                return null;
            }
        } catch (e) {
            console.log(e);
            return undefined;
        } finally {
            await client.close();
        }
    }

    /**
     * Deletes a single item in the database.
     * @param id - Id of the item to delete
     * @returns {Promise<*|null|undefined>} - Deleted item; 'null' if no deletes took place
     * or 'undefined' in case of other errors
     */
    async deleteOne(id) {
        const client = await MongoClient.connect(connectionString);
        const collection = client.db(name).collection(this._collectionName);

        try {
            if (typeof id === "string") id = new ObjectId(id);

            const query = {_id: id};

            // retrieve the old item from the database
            const oldItem = await this.getOne(id);

            const result = await collection.deleteOne(query);
            // check if any documents have been deleted
            if (result.deletedCount === 1) {
                // one document has been deleted, return it
                return oldItem;
            } else {
                // no documents deleted, return 'null'
                return null;
            }
        } catch (e) {
            console.log(e);
            return undefined;
        } finally {
            await client.close();
        }
    }

    /**
     * Verifies if an item exists in the database, using its Id.
     * @param id - Item id used to verify
     * @returns {Promise<boolean|undefined>} -True if item exists, false otherwise
     */
    async existsById(id) {
        const client = await MongoClient.connect(connectionString);
        const collection = client.db(name).collection(this._collectionName);

        try {
            if (typeof id === "string") id = new ObjectId(id);

            const query = {_id: id};

            const item = await collection.findOne(query);

            return item !== null;
        } catch (e) {
            console.log(e);
            return undefined;
        } finally {
            await client.close();
        }
    }
}

class UserDatabase extends MongoDatabase {
    constructor() {
        super(user);
    }

    /**
     * Validates the email and password pair for a user.
     * @param email - Email used to validate
     * @param password - Password used to validate
     * @returns {Promise<boolean|undefined>} - Returns the user if they match, false otherwise
     */
    async validate(email, password) {
        const client = await MongoClient.connect(connectionString);
        const collection = client.db(name).collection(this._collectionName);

        try {
            const query = {email: email};

            const user = await collection.findOne(query);

            if (user === null) {
                return undefined;
            }

            return confirmPassword(password, user.passwordHash) ? user : undefined;
        } catch (e) {
            console.log(e);
            return undefined;
        } finally {
            await client.close();
        }
    }

    /**
     * Verifies if a user exists in the database, using the provided email.
     * @param {string|ObjectId} email - Email used to verify
     * @returns {Promise<boolean|undefined>} -True if user exists, false otherwise
     */
    async existsByEmail(email) {
        const client = await MongoClient.connect(connectionString);
        const collection = client.db(name).collection(this._collectionName);

        try {
            const query = {email: email};

            const user = await collection.findOne(query);

            return user !== null;
        } catch (e) {
            console.log(e);
            return undefined;
        } finally {
            await client.close();
        }
    }
}

module.exports = {
    MongoDatabase,
    UserDatabase,
    userDb: new UserDatabase(),
    bookingDb: new MongoDatabase(config.db.columns.booking),
    replyDb: new MongoDatabase(config.db.columns.reply),
    reviewDb: new MongoDatabase(config.db.columns.review),
    roomDb: new MongoDatabase(config.db.columns.room),
}