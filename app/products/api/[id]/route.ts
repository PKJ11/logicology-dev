import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/productModel";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    const product = await Product.findById(id).select("+images").exec();

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    const body = await req.json();
    console.log("📥 [PUT] Request body received:", body);

    // Find the product document first
    const product = await Product.findById(id);
    console.log("🔍 [PUT] Product found in database:", product ? "Yes" : "No");

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Log current state before update
    console.log("📋 [PUT] Current product state:", {
      title: product.title,
      razorpayItemId: product.razorpayItemId,
      imagesCount: product.images?.length,
      reviewsCount: product.reviews?.length,
    });

    // Update fields individually - THIS IS WHERE THE MAGIC HAPPENS
    product.title = body.title || product.title;
    product.subtitle = body.subtitle || product.subtitle;
    product.price = body.price !== undefined ? body.price : product.price;
    product.description = body.description || product.description;
    product.bannerImage = body.bannerImage || product.bannerImage;
    product.images = body.images && Array.isArray(body.images) ? body.images : product.images || [];
    product.benefits = typeof body.benefits === "string" ? body.benefits : product.benefits || "";
    product.videos = body.videos && Array.isArray(body.videos) ? body.videos : product.videos || [];
    product.reviews =
      body.reviews && Array.isArray(body.reviews) ? body.reviews : product.reviews || [];
    product.razorpayItemId =
      typeof body.razorpayItemId === "string" ? body.razorpayItemId : product.razorpayItemId || "";

    // updatedAt will be automatically handled by timestamps if enabled in schema

    console.log("🔄 [PUT] Product state before save:", {
      title: product.title,
      razorpayItemId: product.razorpayItemId,
      imagesCount: product.images?.length,
      reviewsCount: product.reviews?.length,
    });

    // 🎯 CRITICAL: Use save() instead of findOneAndUpdate
    // This ensures ALL Mongoose features work correctly
    const updatedProduct = await product.save();

    console.log("💾 [PUT] Product successfully saved to database");
    console.log("✅ [PUT] Final database state:", {
      title: updatedProduct.title,
      razorpayItemId: updatedProduct.razorpayItemId,
      imagesCount: updatedProduct.images?.length,
      reviewsCount: updatedProduct.reviews?.length,
      _id: updatedProduct._id,
    });

    // Convert to plain object for response
    const responseProduct = updatedProduct.toObject();

    return NextResponse.json(
      {
        success: true,
        product: responseProduct,
        message: "Product updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [PUT] Error saving product:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.errors || "Validation or save error",
      },
      { status: 500 }
    );
  }
}
