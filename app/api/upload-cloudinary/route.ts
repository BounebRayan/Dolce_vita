import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/verify';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('Upload request received');
    
    const authResult = await verifyToken(req);
    if (!authResult.valid) {
      console.log('Auth failed:', authResult.error);
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    // Check environment variables
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing');
    console.log('Upload Preset:', process.env.CLOUDINARY_UPLOAD_PRESET ? 'Set' : 'Missing');
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_UPLOAD_PRESET) {
      console.error('Missing Cloudinary environment variables');
      return NextResponse.json({ error: 'Cloudinary configuration missing' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    console.log('File received:', file ? `${file.name} (${file.size} bytes)` : 'No file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create FormData for Cloudinary upload
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || '');

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
    console.log('Uploading to Cloudinary:', cloudinaryUrl);
    console.log('Upload preset:', process.env.CLOUDINARY_UPLOAD_PRESET);

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    console.log('Cloudinary response status:', cloudinaryResponse.status);
    
    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error('Cloudinary error:', errorText);
      throw new Error(`Failed to upload to Cloudinary: ${errorText}`);
    }

    const cloudinaryData = await cloudinaryResponse.json();
    console.log('Cloudinary upload successful:', cloudinaryData.secure_url);
    
    return NextResponse.json({ 
      imageUrl: cloudinaryData.secure_url,
      publicId: cloudinaryData.public_id 
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Error uploading image' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authResult = await verifyToken(req);
    if (!authResult.valid) {
      console.log('Auth failed:', authResult.error);
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('publicId');
    
    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary environment variables for deletion');
      return NextResponse.json({ error: 'Cloudinary configuration missing' }, { status: 500 });
    }

    // Delete from Cloudinary
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = require('crypto')
      .createHash('sha1')
      .update(`public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`)
      .digest('hex');

    const deleteFormData = new FormData();
    deleteFormData.append('public_id', publicId);
    deleteFormData.append('timestamp', timestamp.toString());
    deleteFormData.append('api_key', process.env.CLOUDINARY_API_KEY);
    deleteFormData.append('signature', signature);

    const deleteUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`;
    
    const deleteResponse = await fetch(deleteUrl, {
      method: 'POST',
      body: deleteFormData,
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      console.error('Cloudinary delete error:', errorText);
      throw new Error(`Failed to delete from Cloudinary: ${errorText}`);
    }

    const deleteData = await deleteResponse.json();
    console.log('Cloudinary delete successful:', deleteData);
    
    return NextResponse.json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Error deleting image' }, { status: 500 });
  }
}
