import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyToken } from '@/lib/verify';
import connectToDB from '@/config/database';
import HomepageImages from '@/models/homepageImages';

// Force dynamic rendering for all requests (required for PUT)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDB();
    const homepageImages = await (HomepageImages as any).getHomepageImages();
    
    // Convert Maps to objects for JSON response
    const images = {
      banner: homepageImages.banner,
      aboutUs: homepageImages.aboutUs,
      bannerOpacity: homepageImages.bannerOpacity,
      categories: Object.fromEntries(homepageImages.categories),
      categoryVisibility: Object.fromEntries(homepageImages.categoryVisibility),
      categoryOrder: homepageImages.categoryOrder
    };
    
    // Reduced cache time and no stale-while-revalidate to ensure fresh data after updates
    const response = NextResponse.json({ images });
    response.headers.set('Cache-Control', 'public, s-maxage=60, max-age=0, must-revalidate');
    
    return response;
  } catch (error) {
    console.error('Error fetching homepage images:', error);
    return NextResponse.json({ error: 'Error fetching homepage images' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authResult = await verifyToken(req);
    if (!authResult.valid) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { banner, aboutUs, bannerOpacity, categoryKey, categoryImage, categoryVisibilityKey, categoryVisibilityValue, categoryOrder } = await req.json();
    
    await connectToDB();
    const updatedImages = await (HomepageImages as any).updateHomepageImages({
      banner,
      aboutUs,
      bannerOpacity,
      categoryKey,
      categoryImage,
      categoryVisibilityKey,
      categoryVisibilityValue,
      categoryOrder
    });

    // Convert Maps to objects for JSON response
    const images = {
      banner: updatedImages.banner,
      aboutUs: updatedImages.aboutUs,
      bannerOpacity: updatedImages.bannerOpacity,
      categories: Object.fromEntries(updatedImages.categories),
      categoryVisibility: Object.fromEntries(updatedImages.categoryVisibility),
      categoryOrder: updatedImages.categoryOrder
    };

    // Invalidate cache for this route to ensure fresh data on next GET request
    revalidatePath('/api/homepage-images');

    const response = NextResponse.json({ 
      message: 'Homepage images updated successfully',
      images 
    });
    
    // Prevent caching of the PUT response
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error updating homepage images:', error);
    return NextResponse.json({ error: 'Error updating homepage images' }, { status: 500 });
  }
}
