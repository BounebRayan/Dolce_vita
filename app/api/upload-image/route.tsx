import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { verifyToken } from '@/lib/verify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const authResult = await verifyToken(req);
  if (!authResult.valid) {
    return NextResponse.json({ message: authResult.error }, { status: 401 });
  }
    const formData = await req.formData();  // Parse the incoming form data

    const file = formData.get('file');  // Access the file from the form data
    if (file && file instanceof File) {
      // Process the file (e.g., save it to disk)
      const fileBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(fileBuffer);

      const imagePath = path.join(process.cwd(), 'public', 'images', file.name);
      fs.writeFileSync(imagePath, buffer);  // Save the image to disk

      // Construct the image URL (adjust the path based on your setup)
      const imageUrl = `/images/${file.name}`;

      return new NextResponse(
        JSON.stringify({ imageUrl }), // Return the image URL
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new NextResponse(
        JSON.stringify({ error: 'No file uploaded or incorrect field name.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error handling file upload:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error processing the file upload.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const authResult = await verifyToken(req);
  if (!authResult.valid) {
    return NextResponse.json({ message: authResult.error }, { status: 401 });
  }
    // Parse the incoming request body
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName'); 

    if (!fileName) {
      return new NextResponse(
        JSON.stringify({ error: 'File name is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Construct the file path
    const filePath = path.join(process.cwd(), 'public','images', fileName);
    console.log(filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse(
        JSON.stringify({ error: 'File not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the file
    fs.unlinkSync(filePath);

    return new NextResponse(
      JSON.stringify({ message: 'File deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting file:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error deleting the file.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}