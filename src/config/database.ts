import mongoose from "mongoose";
import { environment } from "./enviroment";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  const MONGODB_URI = process.env.MONGODB_URI as string;
  try {
    const conn = await mongoose.connect(environment.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
