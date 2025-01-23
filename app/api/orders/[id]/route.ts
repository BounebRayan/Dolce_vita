import { NextResponse } from 'next/server';
import Order from '@/models/order';
import connectToDB from '@/config/database';
import Product from '@/models/product';
import { verifyToken } from '@/lib/verify';

// Get a single order by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyToken(req);
  if (!authResult.valid) {
    return NextResponse.json({ message: authResult.error }, { status: 401 });
  }
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

    const { status, notes,  deliveredAt, shippedAt } = await req.json();
    const orderId = params.id;

    // Fetch the order and its products
    const order = await Order.findById(orderId).populate('products.product');
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Update the unitsSold for products if the status changes
    if (status === 'Confirmed' || status === 'Cancelled') {
      const adjustment = status === 'Confirmed' ? 1 : -1; // Increment for Confirmed, decrement for Cancelled

      const bulkOperations = order.products.map((item: any) => ({
        updateOne: {
          filter: { _id: item.product._id },
          update: {
            $inc: { unitsSold: adjustment * 1},
          },
        },
      }));

      // Execute bulk update for all products
      if (bulkOperations.length > 0) {
        await Product.bulkWrite(bulkOperations);
      }
    }
    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    if (deliveredAt) updateData.deliveredAt = deliveredAt;
    if (shippedAt) updateData.shippedAt = shippedAt;

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ message: 'Error updating order', error: error }, { status: 400 });
  }
}


// Delete an order
export async function DELETE(req: Request, { params }: { params: { id: string } }) {

  try {
    const authResult = await verifyToken(req);
  if (!authResult.valid) {
    return NextResponse.json({ message: authResult.error }, { status: 401 });
  }
  await connectToDB();
    const deletedOrder = await Order.findByIdAndDelete(params.id);
    
    if (!deletedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting order', error }, { status: 500 });
  }
}
