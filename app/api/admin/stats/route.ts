import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/order';
import Product from '@/models/product';
import connectToDB from '@/config/database';
import { verifyToken } from '@/lib/verify';

export const dynamic = 'force-dynamic';

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
// Fetch order and product stats
export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyToken(req);
    if (!authResult.valid) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }
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

      // Fetch confirmed and pending orders count
      const totalConfirmedOrders = await Order.countDocuments({
        ...orderMatch,
        status: 'Confirmed',
      });

      const totalPendingOrders = await Order.countDocuments({
        ...orderMatch,
        status: 'Pending',
      });

      const totalCancelledOrders = await Order.countDocuments({
        ...orderMatch,
        status: 'Cancelled',
      });

      const totalShippedOrders = await Order.countDocuments({
        ...orderMatch,
        status: 'Shipped',
      });

      const totalDeliveredOrders = await Order.countDocuments({
        ...orderMatch,
        status: 'Delivered',
      });

      stats[period] = {
        ...(orderStats[0] || {
          totalRevenue: 0,
          totalOrders: 0,
          totalProductsSold: 0,
        }),
        totalConfirmedOrders,
        totalPendingOrders,
        totalCancelledOrders,
        totalShippedOrders,
        totalDeliveredOrders,
      };
    }

    return NextResponse.json({
      orderStats: stats
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
