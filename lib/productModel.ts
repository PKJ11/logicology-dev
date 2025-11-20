import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  image: { type: String }, // URL or uploaded image path
});

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    price: { type: Number, required: true },
    razorpayItemId: { type: String, default: "" },
    description: { type: String, required: true },
    bannerImage: { type: String, required: true }, // URL or uploaded image path
    images: { type: [String], default: [] }, // Array of product image URLs for carousel/gallery
    benefits: { type: String, default: "" }, // Short benefits / how-you-benefit text
    videos: { type: [String], default: [] }, // Array of video URLs
    reviews: [ReviewSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "products" }
);

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
