import { NextResponse } from 'next/server';
import Order from '@/models/order';
import Product from '@/models/product';
import connectToDB from '@/config/database';

export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  let status = searchParams.get('status') as string;
  let limit = parseInt(searchParams.get('limit') || '') as number;
  const sortCriteria : { [key: string]: 1 | -1 } =  { "createdAt": -1 } ;
  if (!status) {
    status = 'Pending';
  }
  console.log(status);
  try {
    let orders;
    if (limit) {
     orders = await Order.find({status: status}).populate('products.product').sort(sortCriteria).limit(limit);}
    else { orders = await Order.find({status: status}).populate('products.product').sort(sortCriteria);}
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch orders', error }, { status: 500 });
  }
}

// Create a new order
export async function POST(req: Request) {
  await connectToDB();
  const { name, phoneNumber, address, products } = await req.json();

  try {
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
       product.unitsSold = (product.unitsSold || 0) + quantity;
       await product.save();
       
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
    return NextResponse.json({ message: 'Error creating order', error }, { status: 400 });
  }
}
