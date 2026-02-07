const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set");
    process.exit(1);
  }
};

module.exports = connectDB;