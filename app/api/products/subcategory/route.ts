import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectToDB from '@/config/database';
import { getSubsubcategoriesByType, hasSubsubcategories } from '@/config/categories';

export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);

  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const subsubcategory = searchParams.get('subsubcategory') || '';
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '20000');
  const onSale = searchParams.get('onSale') === 'true';
  const sortAttribute = searchParams.get('sortAttribute') || 'price';
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

  if (!category && !subcategory && !subsubcategory) {
    return NextResponse.json({ message: 'At least one of category, subcategory, or subsubcategory parameter is required' }, { status: 400 });
  }

  try {
    const searchCriteria: any = {
      // Handle isAvailable: not false (includes true and missing/undefined)
      isAvailable: { $ne: false },
      price: { $gte: minPrice, $lte: maxPrice },
      ...(onSale ? { onSale: true } : {}),
    };

    // Handle subsubcategory first (most specific)
    if (subsubcategory) {
      searchCriteria.subSubCategory = subsubcategory;
      // Also ensure it matches the parent subcategory if provided
      if (subcategory) {
        searchCriteria.subCategory = subcategory;
      }
    }
    // Check if category is actually a main category (Meubles or Déco) or a subcategory
    else if (category) {
      if (category === 'Meubles' || category === 'Déco') {
        // It's a main category
        searchCriteria.category = category;
      } else {
        // It's actually a subcategory type
        // Check if this subcategory has subsubcategories
        if (hasSubsubcategories(category)) {
          // Get all subsubcategory types for this subcategory
          const subsubcategories = getSubsubcategoriesByType(category);
          const subsubcategoryTypes = subsubcategories?.map(sub => sub.type) || [];
          
          // Return products from all subsubcategories of this subcategory
          searchCriteria.$or = [
            { subCategory: category, subSubCategory: { $in: subsubcategoryTypes } },
            { subCategory: category, subSubCategory: { $exists: false } } // Include products without subsubcategory
          ];
        } else {
          // No subsubcategories, search by subcategory only
          searchCriteria.subCategory = category;
        }
      }
    }
    
    if (subcategory && !subsubcategory && !category) {
      // Direct subcategory query - check if it has subsubcategories
      if (hasSubsubcategories(subcategory)) {
        const subsubcategories = getSubsubcategoriesByType(subcategory);
        const subsubcategoryTypes = subsubcategories?.map(sub => sub.type) || [];
        
        // Return products from all subsubcategories of this subcategory
        searchCriteria.$or = [
          { subCategory: subcategory, subSubCategory: { $in: subsubcategoryTypes } },
          { subCategory: subcategory, subSubCategory: { $exists: false } } // Include products without subsubcategory
        ];
      } else {
        searchCriteria.subCategory = subcategory;
      }
    }

    const query = Product.find(searchCriteria).sort({ [sortAttribute]: sortOrder });

    const products = await query;
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to search products by category/subcategory', error }, { status: 500 });
  }
}
