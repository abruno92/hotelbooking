/**
 * This file contains the configuration of an Express.js router
 * for the '/review' route.
 */
const express = require("express");
const {createHandler, inputValidator} = require("./restMiddleware");
const {MongoDatabase} = require("../db/database");
const {reviewCol} = require("../db/config");
const {body} = require("express-validator");
const router = express.Router();

const db = new MongoDatabase(reviewCol);

// create
router.post('/',
    body('userId')
        .exists().withMessage("must be provided").bail()
        .isMongoId().withMessage("must be a valid MongoDB ObjectId string"),
    body('content')
        .exists().withMessage("must be provided").bail()
        .notEmpty().withMessage("must not be empty").bail()
        .isLength({max: 1000}).withMessage('must not exceed 1000 characters'),
    inputValidator,
    createHandler(db, "userId", "content"));

// read all
// router.get('/',
//     ,
//     (req, res) => {
//     const query = `SELECT *
//                    FROM main.SkatUser`;
//     db.all(query, (err, rows) => {
//         if (err) {
//             console.log(err);
//             return res.sendStatus(500);
//         } else if (rows === 0) {
//             return res.sendStatus(404);
//         }
//
//         res.json(rows);
//     });
// });
//
// // read one
// router.get('/:id', (req, res) => {
//     const query = `SELECT *
//                    FROM main.SkatUser
//                    WHERE Id = ?`;
//
//     db.get(query, [req.params.id], (err, row) => {
//         if (err) {
//             console.log(err);
//             return res.sendStatus(500);
//         } else if (row === undefined) {
//             return res.sendStatus(404);
//         }
//
//         res.json(row);
//     });
// });
//
// // update
// router.patch('/:id', (req, res) => {
//     const {userId, isActive} = req.body;
//
//     let query = "UPDATE main.SkatUser ";
//     let args = [];
//
//     if (userId !== undefined && isActive !== undefined) {
//         query += 'SET UserId = ?, IsActive = ? ';
//         args.push(parseInt(userId), isActive === 'true');
//     } else if (isActive !== undefined) {
//         query += 'SET IsActive = ? ';
//         args.push(isActive === 'true');
//     } else if (userId !== undefined) {
//         query += 'SET UserId = ? ';
//         args.push(parseInt(userId));
//     } else {
//         return res.sendStatus(400);
//     }
//
//     query += 'WHERE Id = ?';
//     args.push(req.params.id);
//
//     db.run(query, args, (err) => {
//         if (err) {
//             console.log(err);
//             return res.sendStatus(500);
//         }
//
//         res.sendStatus(204);
//     });
// });
//
// // delete
// router.delete('/:id', (req, res) => {
//     const query = `DELETE
//                    FROM main.SkatUser
//                    WHERE Id = ?`;
//     db.run(query, [req.params.id], (err) => {
//         if (err) {
//             console.log(err);
//             return res.sendStatus(500);
//         }
//
//         res.sendStatus(204);
//     });
// });
//
module.exports = router;