import mongoose from 'mongoose';
import Order from '@/models/order';
import connectToDB from '@/config/database';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("q") || '';
    const status = searchParams.get("status");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : null;

    // Validate the limit parameter
    if (limitParam && (limit === null || isNaN(limit))) {
      return NextResponse.json(
        { message: 'Invalid limit parameter. It must be a number.' },
        { status: 400 }
      );
    }

    // Check if searchTerm can be a valid ObjectId
    const objectId = mongoose.Types.ObjectId.isValid(searchTerm)
      ? new mongoose.Types.ObjectId(searchTerm)
      : null;

    // Construct query
    const query: { [key: string]: any } = {
      $and: [],
    };

    // Add search condition
    if (searchTerm) {
      query.$and.push({
        $or: [
          objectId ? { _id: objectId } : {},
          { name: { $regex: searchTerm, $options: 'i' } },
          { phoneNumber: { $regex: searchTerm, $options: 'i' } },
        ],
      });
    }

    // Add status condition
    if (status) {
      query.$and.push({ status });
    }

    // Remove $and if it's empty
    if (query.$and.length === 0) {
      delete query.$and;
    }

    // Sort criteria
    const sortCriteria: { [key: string]: 1 | -1 } = { createdAt: -1 };

    // Fetch orders with optional limit and query
    const ordersQuery = Order.find(query)
      .populate('products.product')
      .sort(sortCriteria);

    const orders = limit ? await ordersQuery.limit(limit) : await ordersQuery;

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders', error },
      { status: 500 }
    );
  }
}
