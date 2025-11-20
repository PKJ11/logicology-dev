import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(MONGO_URI, {
    dbName: "logicology",
  });
};
