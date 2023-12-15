const dotenv = require("dotenv");
dotenv.config();

module.exports.PORT = process.env.PORT;
module.exports.DB_MONGO_URL = process.env.DB_MONGO_URL;