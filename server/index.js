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
const {parseJwtToken} = require("./middleware");

const app = express();

const port = process.env.PORT || 3001;

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(parseJwtToken);

app.use('/auth', authRoute);
app.use('/booking', bookingRoute);
app.use('/room', roomRoute);

app.listen(port, () => console.log(`Listening on port ${port}`))
