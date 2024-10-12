import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectToDB from '@/config/database'
export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const subcategory = searchParams.get('subcategory') || '';
  const limit = searchParams.get('limit') || "10";

  if (!subcategory) {
    return NextResponse.json({ message: 'Subcategory parameter is required' }, { status: 400 });
  }

  try {
    const query = Product.find({
      subCategory: { $regex: subcategory, $options: 'i' }, // Case-insensitive search
    }).limit(parseInt(limit, 10));

    const products = await query;
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to search products by subcategory', error }, { status: 500 });
  }
}
