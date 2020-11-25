/**
 * This file contains database-related functions.
 */

const config = require("./config");
const {MongoClient, ObjectId} = require('mongodb');

module.exports.MongoDatabase = class MongoDatabase {
    _collectionName;

    constructor(collectionName) {
        this._collectionName = collectionName;
    }

    async create(item) {
        const client = await MongoClient.connect(config.connectionUrl);
        const collection = client.db(config.databaseName).collection(this._collectionName);

        try {
            const writeResult = await collection.insertOne(item);
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
        const collection = client.db(config.databaseName).collection(this._collectionName);

        try {
            if (typeof id === "string") id = new ObjectId(id);

            const query = {_id: id};

            return await collection.findOne(query);
        } catch (err) {
            console.log(err);
            return undefined;
        } finally {
            await client.close();
        }
    }

    async getAll() {
        const client = await MongoClient.connect(config.connectionUrl);
        const collection = client.db(config.databaseName).collection(this._collectionName);

        const cursor = collection.find();

        try {
            return await cursor.toArray();
        } catch (err) {
            console.log(err);
            return undefined;
        } finally {
            await client.close();
            await cursor.close();
        }
    }
}