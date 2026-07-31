import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  brand: string;
  price: number;
  image: string;
  description: string;
  skinType: string[];
  skinTone: string[];
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    skinType: {
      type: [String],
      default: [],
    },

    skinTone: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ name: "text", brand: "text", category: "text" });
ProductSchema.index({ skinType: 1 });
ProductSchema.index({ skinTone: 1 });

export default mongoose.model<IProduct>(
  "Product",
  ProductSchema
);