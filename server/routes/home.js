/**
 * This file contains the configuration of an Express.js router
 * for the '/home' route.
 */
const express = require("express");
const {getAuthLevelMw} = require("./middleware");
const {simpleRedirect} = require("./handlers");

const route = express.Router();

// middleware to restrict access to privilegeLevel '0'
route.use(getAuthLevelMw('0'));

// redirects clients visiting '/' to '/home/index.html'
route.get('/', simpleRedirect('/home/index.html'));

// redirects clients visiting '/account' to '/login.html'
route.get('/account', simpleRedirect('/login.html'));

// redirects clients visiting '/account/bookings' to '/TODO'
// todo: create bookings page and add it here
route.get('/account/bookings', simpleRedirect('/TODO'));

module.exports = route;