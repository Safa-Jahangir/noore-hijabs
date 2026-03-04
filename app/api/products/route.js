import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// ✅ GET PRODUCTS (Dynamic Filtering: Category, Price, & Discounts)
export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    // Get params from URL
    const category = searchParams.get("category");
    const minPrice = searchParams.get("min");
    const maxPrice = searchParams.get("max");
    const discounted = searchParams.get("discounted");

    let filter = {};

    // 🏷 1. Category Filter
    if (category && category !== "all") {
      filter.category = category;
    }

    // 💰 2. Price Range Filter ($gte = Greater Than or Equal, $lte = Less Than or Equal)
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 🔥 3. Discount Filter (Returns items where discount > 0)
    if (discounted === "true") {
      filter.discount = { $gt: 0 };
    }

    // Execute query with sorting (Newest first)
    const products = await Product.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (err) {
    console.error("Filter Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ✅ ADD PRODUCT (Remains same, ensuring category is saved)
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const product = await Product.create({
      name: body.name,
      description: body.description,
      price: Number(body.price),
      image: body.image,
      category: body.category, 
      discount: Number(body.discount) || 0,
      colors: body.colors || [],
      featured: body.featured || false,
      stock: Number(body.stock) || 0,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}