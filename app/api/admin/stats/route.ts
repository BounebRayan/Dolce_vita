// app/api/order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/order';
import Product from '@/models/product';
import connectToDB from '@/config/database';

// Helper function to get date ranges
const getDateRange = (period: string) => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0)); // Start of today
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7)); // 7 days ago
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1)); // 1 month ago
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1)); // 1 year ago
      break;
    default:
      startDate = new Date(now.setFullYear(now.getFullYear() - 1)); // Default to 1 year
      break;
  }

  return startDate;
};

const categories = [
  'Accessoires déco',
  'Vases',
  'Cadres photo',
  'Luminaires',
  'Miroirs',
  'Déco murale',
  "Bougies & parfums d'intérieur",
  'linges de maison',
  'Salons',
  'Chambres',
  'Salles À Manger',
];

// Fetch order and product stats
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const periods = ['today', 'week', 'month', 'year'];
    const stats: Record<string, any> = {};

    // Loop through periods for order stats
    for (const period of periods) {
      const startDate = getDateRange(period);

      // Match object for filtering orders by date range
      const orderMatch: any = {
        createdAt: { $gte: startDate },
      };

      // Fetch order stats
      const orderStats = await Order.aggregate([
        { $match: orderMatch },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            totalOrders: { $sum: 1 },
            totalProductsSold: { $sum: { $size: '$products' } },
          },
        },
      ]);

      stats[period] = orderStats[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        totalProductsSold: 0,
      };
    }

    // Fetch product stats
    const productStats: { [key: string]: any } = {};

    for (const period of periods) {
      const startDate = getDateRange(period);

      const productMatch: any = {
        createdAt: { $gte: startDate },
        'products.product.category': { $in: categories },
      };

      const categoryStats = await Product.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'products.product',
            as: 'ordersData',
          },
        },
        { $unwind: '$ordersData' },
        { $match: { 'ordersData.createdAt': { $gte: startDate } } },
        {
          $group: {
            _id: '$category',
            totalSold: { $sum: 1 },
            totalRevenue: { $sum: '$ordersData.totalAmount' },
            mostSoldItem: {
              $push: {
                name: '$name',
                ref: '$ref',
                sold: '$ordersData.quantity',
              },
            },
          },
        },
        { $sort: { totalSold: -1 } },
      ]);

      productStats[period] = categoryStats.reduce((acc, category) => {
        const mostSold = category.mostSoldItem.sort((a: { sold: number; }, b: { sold: number; }) => b.sold - a.sold)[0];
        acc[category._id] = {
          totalSold: category.totalSold,
          totalRevenue: category.totalRevenue,
          mostSoldItem: {
            name: mostSold.name,
            ref: mostSold.ref,
          },
        };
        return acc;
      }, {});
    }

    return NextResponse.json({
      orderStats: stats,
      productStats: productStats,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
