import mongoose, { Schema, Document } from "mongoose";

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  image: string;
  skinType: string;
  skinTone: string;
  concerns: string[];
  recommendedProducts: mongoose.Types.ObjectId[];
}

const historySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    skinType: {
      type: String,
      required: true,
    },

    skinTone: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IHistory>(
  "History",
  historySchema
);