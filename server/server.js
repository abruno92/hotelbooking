/**
 * This file contains the configuration and entry point for the Node.js server.
 */
const path = require('path');
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const mw = require('./middleware');
const indexRouter = require("./indexRouter");
const homeRouter = require("./homeRouter");

const port = 3001;
const server = express();

// console logging
server.use(logger('dev'));
// parsing application/x-www-form-urlencoded
server.use(express.urlencoded({extended: false}));
// enables cookies
server.use(cookieParser());
// adds the AuthToken cookie to the Request object
server.use(mw.parseJwtToken);

// index and home routers
server.use('/', indexRouter);
server.use('/home', homeRouter);

// enables serving of static files under the 'static' directory
server.use(express.static(path.join(__dirname, 'static')));

// creates a '404' error if reached
server.use(mw.notFoundCreator);

// error handler
server.use(mw.errorHandler);

// starting point
server.listen(port, () => {
    console.log(`starting server on ${port}`);
});