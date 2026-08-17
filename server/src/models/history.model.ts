import mongoose, { Schema, Document } from "mongoose";

export type HistoryType = "analysis" | "tryon";

export interface IHistory extends Document {
  userId: string;
  type: HistoryType;
  image?: string;
  /** Durable `/gallery/...` copy of the picture shown on the dashboard. */
  resultImage?: string;
  label?: string;
  tryonKind?: "clothes" | "makeup" | "hair";
  colourHex?: string;
  source?: string;
  skinType?: string;
  skinTone?: string;
  concerns?: string[];
  recommendedProducts?: mongoose.Types.ObjectId[];
  report?: unknown;
  season?: string;
  createdAt: Date;
}

const historySchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["analysis", "tryon"],
      default: "analysis",
      index: true,
    },

    image: {
      type: String,
    },

    resultImage: {
      type: String,
    },

    label: {
      type: String,
      maxlength: 120,
    },

    tryonKind: {
      type: String,
      enum: ["clothes", "makeup", "hair"],
    },

    colourHex: {
      type: String,
      maxlength: 9,
    },

    source: {
      type: String,
      maxlength: 32,
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
historySchema.index({ userId: 1, type: 1, createdAt: -1 });

export default mongoose.model<IHistory>(
  "History",
  historySchema
);
