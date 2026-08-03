import mongoose, { Schema, Document } from "mongoose";

export interface IHistory extends Document {
  userId: string;
  image?: string;
  skinType?: string;
  skinTone?: string;
  concerns?: string[];
  recommendedProducts?: mongoose.Types.ObjectId[];
  report?: unknown;
  season?: string;
}

const historySchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    image: {
      type: String,
    },

    skinType: {
      type: String,
    },

    skinTone: {
      type: String,
    },

    concerns: {
      type: [String],
      default: [],
    },

    recommendedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    report: {
      type: Schema.Types.Mixed,
    },

    season: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

historySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IHistory>(
  "History",
  historySchema
);
