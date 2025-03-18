const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => console.log("Database is connected."))
    .catch((error) => console.log("Error in connection.",error));
};

module.exports = { initializeDatabase };
