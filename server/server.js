/**
 * This file contains the configuration and entry point for the Node.js server.
 */
const https = require("https");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const bookingRoute = require('./routes/booking');
const roomRoute = require('./routes/room');
const reviewRoute = require('./routes/review');
const replyRoute = require('./routes/reply');
const fs = require("fs");
const {port} = require("./config");
const {parseAuthToken} = require("./middleware/misc");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(parseAuthToken);

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/booking', bookingRoute);
app.use('/room', roomRoute);
app.use('/review', reviewRoute);
app.use('/review/:reviewId/reply', replyRoute);

https.createServer({
    key: fs.readFileSync('encryption/hotelbooking_key.pem'),
    cert: fs.readFileSync('encryption/hotelbooking_cert.pem')
}, app).listen(port, () => {
    console.log(`Listening on port ${port}`);
})
