// /pages/api/orders/search.ts
import { NextApiRequest, NextApiResponse } from 'next';// Adjust the path as needed
import Order from '@/models/order';// Adjust the path as needed
import connectToDB from '@/config/database';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("q") || ''; // Search term from query string

  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' });
  }

  try {
    await connectToDB();

    // Search across _id, name, and phoneNumber fields (case-insensitive)
    const orders = await Order.find({
      $or: [
        { _id:  searchTerm },
        { name: searchTerm} ,
        { phoneNumber: searchTerm},
      ],
    }).sort({ createdAt: -1 }); // Sort by creation date, newest first

   return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' });
  }
}
