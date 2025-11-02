import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET ? 'Set' : 'Missing',
    hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
    hasUploadPreset: !!process.env.CLOUDINARY_UPLOAD_PRESET,
  });
}

