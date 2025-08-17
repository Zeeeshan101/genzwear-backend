// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // image URL
    },
    category: {
      type: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
