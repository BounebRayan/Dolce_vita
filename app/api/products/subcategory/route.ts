import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectToDB from '@/config/database';

export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);

  const subcategory = searchParams.get('subcategory') || '';
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '20000');
  const onSale = searchParams.get('onSale') === 'true';
  const sortAttribute = searchParams.get('sortAttribute') || 'price';
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

  if (!subcategory) {
    return NextResponse.json({ message: 'Subcategory parameter is required' }, { status: 400 });
  }

  try {
    const query = Product.find({
      subCategory: { $regex: subcategory, $options: 'i' },
      price: { $gte: minPrice, $lte: maxPrice },
      ...(onSale ? { onSale: true } : {}),
    }).sort({ [sortAttribute]: sortOrder });

    const products = await query;
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to search products by subcategory', error }, { status: 500 });
  }
}
