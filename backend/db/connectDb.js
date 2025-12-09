import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();



const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URL:", process.env.MONGO_URL ? "URL is set" : "URL is UNDEFINED");
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
