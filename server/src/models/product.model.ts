import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  externalId?: string;
  name: string;
  category: string;
  brand: string;
  price?: number;
  image: string;
  description: string;
  skinType: string[];
  skinTone: string[];
  /** Garment catalogue extensions — populated from garments.json. */
  colourHex?: string;
  colourName?: string;
  gender?: string;
  buyUrl?: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    externalId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

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
      default: "",
    },

    price: {
      type: Number,
      // Optional now — catalogue garments carry no price and we never
      // fabricate one.
      required: false,
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

    colourHex: String,
    colourName: String,
    gender: String,
    buyUrl: String,
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ name: "text", brand: "text", category: "text" });
ProductSchema.index({ skinType: 1 });
ProductSchema.index({ skinTone: 1 });
ProductSchema.index({ gender: 1 });

export default mongoose.model<IProduct>(
  "Product",
  ProductSchema
);
