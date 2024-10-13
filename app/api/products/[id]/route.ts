import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectToDB from '@/config/database';


export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectToDB();
  try {
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching product', error }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await connectToDB();
    const productData = await req.json();
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        params.id,
        productData,
        { new: true, runValidators: true }
      );
  
      if (!updatedProduct) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: 'Error updating product', error }, { status: 400 });
    }
  }

  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectToDB();
    try {
      const deletedProduct = await Product.findByIdAndDelete(params.id);
      if (!deletedProduct) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: 'Error deleting product', error }, { status: 500 });
    }
  }
  