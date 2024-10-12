import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectToDB from '@/config/database'; // Adjust the import according to your project structure

export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('query') || '';

  if (!searchQuery) {
    return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const products = await Product.find({
      productName: { $regex: searchQuery, $options: 'i' }, // Case-insensitive search
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to search products by name', error }, { status: 500 });
  }
}
