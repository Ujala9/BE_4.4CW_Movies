const mongoose = require("mongoose");

const initializeDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected Successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

module.exports = { initializeDatabase };
