import mongoose, { Schema, Document } from "mongoose";

export interface ITryOnUsage extends Document {
  email: string;
  count: number;
}

const TryOnUsageSchema = new Schema<ITryOnUsage>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITryOnUsage>("TryOnUsage", TryOnUsageSchema);