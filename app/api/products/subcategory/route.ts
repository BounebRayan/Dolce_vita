import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectToDB from '@/config/database';

export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);

  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '20000');
  const onSale = searchParams.get('onSale') === 'true';
  const sortAttribute = searchParams.get('sortAttribute') || 'price';
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

  if (!category && !subcategory) {
    return NextResponse.json({ message: 'At least one of category or subcategory parameter is required' }, { status: 400 });
  }

  try {
    const searchCriteria: any = {
      // Handle isAvailable: not false (includes true and missing/undefined)
      isAvailable: { $ne: false },
      price: { $gte: minPrice, $lte: maxPrice },
      ...(onSale ? { onSale: true } : {}),
    };

    // Check if category is actually a main category (Meubles or Déco) or a subcategory
    if (category) {
      if (category === 'Meubles' || category === 'Déco') {
        // It's a main category
        searchCriteria.category = category;
      } else {
        // It's actually a subcategory type
        searchCriteria.subCategory = category;
      }
    }
    
    if (subcategory) {
      searchCriteria.subCategory = { $regex: subcategory, $options: 'i' };
    }

    const query = Product.find(searchCriteria).sort({ [sortAttribute]: sortOrder });

    const products = await query;
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to search products by category/subcategory', error }, { status: 500 });
  }
}
