/**
 * This file contains the configuration of an Express.js router
 * for the '/user' route.
 */
const express = require("express");
const config = require("../config");
const {axiosJwtCookie} = require("../utils");
const {readHandler} = require("../middleware/restful");
const {parseObjectId, inputValidator, isCurrentUser} = require("../middleware/inputParsing");
const {authGuard} = require('../middleware/misc');
const router = express.Router();
const {userDb} = require("../db/database")
const path = require('path');
const fs = require('fs');

router.use(authGuard(config.db.privileges.userAny));

// get current authenticated user
router.get('/current',
    authGuard(config.db.privileges.userAny),
    // add current user id to req.params
    (req, _, next) => {
        req.params.id = req.user._id;
        next()
    },
    // handle read
    readHandler(userDb, user => {
        // remove passwordHash field
        delete user.passwordHash;
        return user;
    })
);

// get user avatar
router.get('/:id/picture',
    // 'id' URL param
    parseObjectId('id', async (value) => await userDb.existsById(value))
        // check that the authenticated user is the one making the post request
        .custom(isCurrentUser),
    // validate above attribute
    inputValidator,
    async (req, res) => {
        // use the user's id as the filename for the avatar
        const fileId = req.params.id.toString();

        // directory where the avatar will be found
        const avatarDirectoryPath = path.join(config.userAvatarDir);

        let avatarList;

        try {
            // retrieve the list of filenames within the directory
            avatarList = fs.readdirSync(avatarDirectoryPath);
        } catch (e) {
            console.log(e);
            if (e.code === 'ENOENT') {
                // the directory does not exist, therefore no avatar exists either
                return res.status(404).json({
                    error: 'no profile picture found',
                });
            }

            return res.sendStatus(500);
        }

        // find the filename that contains the fileId of the avatar
        const avatar = avatarList.find(avatarItem => avatarItem.includes(fileId));

        if (!avatar) {
            return res.status(404).json({
                error: 'no profile picture found',
            });
        }
        // build the absolute path to the avatar
        const avatarFile = path.join(avatarDirectoryPath, avatar);

        // send the avatar file as response
        res.sendFile(avatarFile);
    }
);

// change user avatar
router.put('/:id/picture',
    // 'id' URL param
    parseObjectId('id', async (value) => await userDb.existsById(value))
        // check that the authenticated user is the one making the post request
        .custom(isCurrentUser),
    // validate above attribute
    inputValidator,
    async (req, res) => {
        if (!req.files) {
            // no files have been provided in the request
            return res.status(400).json({
                error: "No file uploaded",
            })
        }

        // check if the user already has an avatar
        let userHadAvatar = true;
        try {
            // delete existing avatar of the user if possible
            await axiosJwtCookie(req).delete(`/user/${req.params.id}/picture`);
        } catch (e) {
            if (e.response) {
                if (e.response.status === 404) {
                    // if the status is 404, no avatar existed for this user
                    userHadAvatar = false;
                } else {
                    // if the status is anything else, send an internal error response
                    console.log(e);
                    return res.status(500).send(e.response.data.error);
                }
            } else {
                return res.status(500).send(e);
            }
        }

        // get the avatar picture provided in the request body
        const profilePicture = req.files.picture;

        // use the user's id as the filename for the avatar
        const fileId = req.params.id.toString();

        // get the file extension using the mimetype (e.g. 'image/png')
        const fileExtension = profilePicture.mimetype.split('/').pop();

        // generate the file path where the avatar will be saved
        const filePath = path.join(config.userAvatarDir, `${fileId}.${fileExtension}`);

        // save the avatar picture to that location
        await profilePicture.mv(filePath);

        // return 201 if an avatar has been set for the first time
        // or 200 if the old avatar was replaced
        return res.sendStatus(userHadAvatar ? 200 : 201);
    }
);

// delete user avatar
router.delete('/:id/picture',
    // 'id' URL param
    parseObjectId('id', async (value) => await userDb.existsById(value))
        // check that the authenticated user is the one making the post request
        .custom(isCurrentUser),
    // validate above attribute
    inputValidator,
    async (req, res) => {
        // use the user's id as the filename for the avatar
        const fileId = req.params.id.toString();

        // generate the file path where the avatar will be found
        const avatarDirectoryPath = path.join(config.userAvatarDir);

        let avatarList;

        try {
            // retrieve the list of filenames within the directory
            avatarList = fs.readdirSync(avatarDirectoryPath);
        } catch (e) {
            console.log(e);
            if (e.code === 'ENOENT') {
                // the directory does not exist, therefore no avatar exists either
                return res.status(404).json({
                    error: 'no profile picture found',
                });
            }

            return res.sendStatus(500);
        }

        // find the filename that contain the fileId of the avatar
        // in case of anomalies, multiple files may exist
        const foundAvatars = avatarList.filter(avatarItem => avatarItem.includes(fileId));

        // remove existing avatar file/s
        for (const avatar of foundAvatars) {
            fs.unlinkSync(path.join(avatarDirectoryPath, avatar));
        }

        res.sendStatus(204);
    }
);

// read user
router.get('/:id',
    authGuard(config.db.privileges.userAny),
    // 'id' URL param
    parseObjectId(),//.custom(isCurrentUser),
    // validate above attribute
    inputValidator,
    // handle read
    readHandler(userDb, user => {
        // remove passwordHash field
        delete user.passwordHash;
        return user;
    })
);

module.exports = router;