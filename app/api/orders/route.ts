import { NextResponse } from 'next/server';
import Order from '@/models/order';
import Product from '@/models/product';
import connectToDB from '@/config/database';
import { verifyToken } from '@/lib/verify';


export async function GET(req: Request) {
  try {
    const authResult = await verifyToken(req);
  if (!authResult.valid) {
    return NextResponse.json({ message: authResult.error }, { status: 401 });
  }
    await connectToDB();


    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : null; 
    const sortCriteria: { [key: string]: 1 | -1 } = { createdAt: -1 };

    // Validate the limit parameter
    if (limitParam && (limit === null || isNaN(limit))) {
      return NextResponse.json(
        { message: 'Invalid limit parameter. It must be a number.' },
        { status: 400 }
      );
    }

    console.log(
      `Fetching orders with${status ? ` status: ${status},` : ''} limit: ${
        limit || 'No limit'
      }`
    );

    // Construct the query
    const query: { [key: string]: any } = {};
    if (status) {
      query.status = status;
    }

    // Fetch orders with optional limit and query
    const ordersQuery = Order.find(query)
      .populate('products.product')
      .sort(sortCriteria);
    const orders = limit ? await ordersQuery.limit(limit) : await ordersQuery;

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders', error},
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { name, phoneNumber, address, products } = await req.json();
    if (!name || !phoneNumber || !address || !products || !products.length) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ message: `Product with ID ${item.product} not found` }, { status: 400 });
      }

      if (!item.color || !item.image) {
        return NextResponse.json({ message: 'Each product must have a color, an image, and a reference specified.' }, { status: 400 });
      }

      const quantity = item.quantity || 1;
      totalAmount += (product?.onSale ? (product.price * (1 - product.salePercentage / 100)).toFixed(0): product?.price.toFixed(0) )* quantity;

       // Increment the product's unitsSold
       //product.unitsSold = (product.unitsSold || 0) + quantity;
       //await product.save();
       
      orderProducts.push({
        product: item.product,
        productName: item.productName,
        reference: item.reference,
        color: item.color,
        image: item.image,
      });
    }

    const newOrder = new Order({
      name,
      phoneNumber,
      address,
      products: orderProducts,
      totalAmount,
    });

    await newOrder.save();
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating order', error }, { status: 500 });
  }
}
