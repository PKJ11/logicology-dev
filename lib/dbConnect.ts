import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/primetime-game?retryWrites=true&w=majority&appName=Cluster0"; // change DB name if needed

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
