import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectToDB from '@/config/database';

export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('query') || '';
  const priceMin = parseFloat(searchParams.get('priceMin') || '0');
  const priceMax = parseFloat(searchParams.get('priceMax') || '20000');
  const onSale = searchParams.get('onSale') === 'true';
  const sort = searchParams.get('sort') || 'price';
  const order = searchParams.get('order') === 'asc' ? 1 : -1;

  if (!searchQuery) {
    return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const products = await Product.find({
      productName: { $regex: searchQuery, $options: 'i' },
      price: { $gte: priceMin, $lte: priceMax },
      ...(onSale && { onSale: true }),
    })
      .sort({ [sort]: order });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to search products by name', error }, { status: 500 });
  }
}
