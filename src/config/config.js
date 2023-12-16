const dotenv = require("dotenv");
dotenv.config();

module.exports.PORT = process.env.PORT;
module.exports.DB_MONGO_URL = process.env.DB_MONGO_URL;
module.exports.MAIL_EMAIL = process.env.MAIL_EMAIL;
module.exports.MAIL_PASSWORD = process.env.MAIL_PASSWORD;