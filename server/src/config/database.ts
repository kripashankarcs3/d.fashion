import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};