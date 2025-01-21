import { NextRequest,NextResponse } from "next/server";

import Product from '@/models/product';
import connectToDB from '@/config/database';
// Helper function to calculate date range
const getDateRange = (months: number) => {
  const now = new Date();
  const start = new Date(now.setMonth(now.getMonth() - months));
  return { start, end: new Date() };
};

// Get product statistics
export async function GET(req: NextRequest)  {
  try {
    // Get most sold products for different time periods
    const timeRanges = {
      month: getDateRange(1),
      threeMonths: getDateRange(3),
      year: getDateRange(12),
    };

    const stats = await Promise.all(
      Object.entries(timeRanges).map(async ([key, { start, end }]) => {
        const mostSoldProducts = await Product.find({
          createdAt: { $gte: start, $lte: end },
        })
          .sort({ unitsSold: -1 })
          .limit(5)
          .select('productName unitsSold category subCategory _id');

        return { period: key, products: mostSoldProducts };
      })
    );

    // Get most successful subcategories
    const successfulSubcategories = await Product.aggregate([
      {
        $group: {
          _id: '$subCategory',
          totalUnitsSold: { $sum: '$unitsSold' },
        },
      },
      { $sort: { totalUnitsSold: -1 } },
      { $limit: 5 },
    ]);

    return NextResponse.json({ stats, successfulSubcategories });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
