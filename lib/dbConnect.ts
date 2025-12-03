import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/primetime-game"; // change DB name if needed

async function dbConnect() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

export default dbConnect;
