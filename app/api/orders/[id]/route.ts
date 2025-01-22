import { NextResponse } from 'next/server';
import Order from '@/models/order';
import connectToDB from '@/config/database';
import Product from '@/models/product';

// Get a single order by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const order = await Order.findById(params.id).populate('products.product');
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching order', error }, { status: 500 });
  }
}

// Update order status
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const { status } = await req.json();
    /*if (status && status == "Confirmed") {const order = await Order.findById(params.id).populate('products.product'); for (const item of order.products){const product = await Product.findById(item.product); product.unitsSold = (product.unitsSold || 0) + item.quantity;
      await product.save();} }
    if (status && status == "Cancelled") {const order = await Order.findById(params.id).populate('products.product'); for (const item of order.products){const product = await Product.findById(item.product); product.unitsSold = (product.unitsSold || 0) - item.quantity;
      await product.save();}}*/
    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating order', error }, { status: 400 });
  }
}

// Delete an order
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDB();
  try {
    const deletedOrder = await Order.findByIdAndDelete(params.id);
    
    if (!deletedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting order', error }, { status: 500 });
  }
}
