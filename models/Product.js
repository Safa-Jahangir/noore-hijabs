import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  discount: {
    type: Number,
    default: 0,
  },
  colors: {
    type: [String],
    default: [],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ["hijab", "abaya", "deal"]
  },
}, { timestamps: true });



export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);