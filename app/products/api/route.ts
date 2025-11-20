import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/productModel";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const products = await Product.find({}).select("+images").exec();
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { title, subtitle, price, description, bannerImage, images, benefits, videos, reviews } =
      body;

    if (!title || !subtitle || !price || !description || !bannerImage) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = new Product({
      title,
      subtitle,
      price,
      description,
      bannerImage,
      images: images && Array.isArray(images) ? images : [],
      benefits: benefits || "",
      videos: videos && Array.isArray(videos) ? videos : [],
      reviews: reviews && Array.isArray(reviews) ? reviews : [],
    });

    await product.save();

    return NextResponse.json(
      { success: true, product, message: "Product created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
