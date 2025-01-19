import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectToDB from '@/config/database';
// Get all products
export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '12', 12);

  try {
    const products = await Product.find({'onSale':true}).limit(limit);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch products', error }, { status: 500 });
  }
}