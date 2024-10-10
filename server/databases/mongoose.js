import mongoose from "mongoose";

async function connectDB () {
  try {
    await mongoose.connect("mongodb://localhost:27017/noteflow", {
  
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;