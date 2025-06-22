const mongoose = require("mongoose")
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI

const initializeDatabase = async  () => {
  try {
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connection) {
      console.log("connected succesfully");
    }
  } catch (error) {
    console.log("connection failed", error);
  }
}

module.exports = { initializeDatabase }