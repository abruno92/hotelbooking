/**
 * This file contains database-related functions.
 */

const config = require("./config");
const {MongoClient} = require('mongodb');

module.exports.MongoDatabase = class MongoDatabase {
    _collectionName;

    constructor(collectionName) {
        this._collectionName = collectionName;
    }

    async create(object) {
        const client = await MongoClient.connect(config.connectionUrl);

        try {
            const collection = client.db(config.databaseName).collection(this._collectionName);

            const writeResult = await collection.insertOne(object);
            return writeResult.insertedId;
        } catch (err) {
            console.log(err);
            return undefined;
        } finally {
            await client.close();
        }
    }

    async getOne(id) {
        const client = await MongoClient.connect(config.connectionUrl);

        try {
            const collection = client.db(config.databaseName).collection(this._collectionName);

            const query = {_id: id};

            return await collection.findOne(query);
        } catch (err) {
            console.log(err);
            return undefined;
        } finally {
            await client.close();
        }
    }
}