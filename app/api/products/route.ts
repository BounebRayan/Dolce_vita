import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectToDB from '@/config/database';

// Get all products
export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const sortField = searchParams.get('sort') || 'createdAt';
  const limit = parseInt(searchParams.get('limit') || '12', 12);
  const category= searchParams.get("category") || 'all';

  const sortCriteria: { [key: string]: 1 | -1 } = sortField === 'unitsSold' ? { unitsSold: -1 } : { [sortField]: -1 };

  try {
    let products;
    if (category === 'all') { products = await Product.find().sort(sortCriteria).limit(limit); }
    else { products = await Product.find({ category: category }).sort(sortCriteria).limit(limit); }
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch products', error }, { status: 500 });
  }
}

// Create a new product
export async function POST(req: Request) {
  try {
    const { verifyToken } = await import('@/lib/verify');
    const authResult = await verifyToken(req);
  if (!authResult.valid) {
    return NextResponse.json({ message: authResult.error }, { status: 401 });
  }
    await connectToDB();
    const productData = await req.json();
    const newProduct = new Product({
      ...productData,
      createdAt: new Date(),
    });

    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating product', error }, { status: 400 });
  }
}

