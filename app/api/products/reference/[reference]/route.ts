import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectToDB from '@/config/database';

export async function GET(req: Request, { params }: { params: { reference: string } }) {
  await connectToDB();
  try {
    const product = await Product.findOne({ reference: params.reference });
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching product', error }, { status: 500 });
  }
}
