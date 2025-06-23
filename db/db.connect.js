const mongoose = require("mongoose")
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI

const initializeDatabase = async  () => {
  try {
    const connection = await mongoose.connect(mongoURI)
    
    if (connection) {
      console.log("Connected successfully to MongoDB");
    }
  } catch (error) {
    console.log("Connection failed", error);
  }
}

module.exports = { initializeDatabase }