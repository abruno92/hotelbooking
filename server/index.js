/**
 * This file contains the configuration and entry point for the Node.js server.
 */
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const bookingRoute = require('./routes/booking');
const roomRoute = require('./routes/room');
const reviewRoute = require('./routes/review');
const replyRoute = require('./routes/reply');
const {port} = require("./config");
const {parseJwtToken} = require("./middleware");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(parseJwtToken);

app.use('/auth', authRoute);
app.use('/booking', bookingRoute);
app.use('/room', roomRoute);
app.use('/review', reviewRoute);
app.use('/review/:reviewId/reply', replyRoute);

app.listen(port, () => console.log(`Listening on port ${port}`))
