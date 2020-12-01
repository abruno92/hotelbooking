const {jwtSecret} = require("./jwtSecret");

const config = {};

config.jwt = {};
config.db = {};
config.db.columns = {};
config.db.privileges = {};

config.port = process.env.PORT || 3001;
config.locale = "da-DK";

config.jwt.expirySeconds = 60 * 10;
config.jwt.tokenCookie = "JwtToken";
config.jwt.secret = jwtSecret;

config.db.privileges.userLow = "0";
config.db.privileges.userHigh = "1";
config.db.privileges.userAny = "-1";

config.db.connectionString = process.env.DB_CONNECTIONSTRING || "mongodb://localhost:3002/hotel";
config.db.name = "hotel";
config.db.columns.booking = "Booking";
config.db.columns.reply = "Reply";
config.db.columns.review = "Review";
config.db.columns.room = "Room";
config.db.columns.user = "User";

module.exports = config;