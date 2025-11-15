'use client';

import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';
import { useEffect, useState } from 'react';

const Zodiak = localFont({
  src: [
    { path: '../../public/fonts/Zodiak/Zodiak-Thin.otf', weight: '100', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Light.otf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Bold.otf', weight: '700', style: 'normal' },
  ],
});

const Sora = localFont({
  src: [
    { path: '../../public/fonts/Sora/Sora-Light.otf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Sora/Sora-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Sora/Sora-Bold.otf', weight: '700', style: 'normal' },
  ],
});


export default function Banner() {
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [bannerOpacity, setBannerOpacity] = useState(30);

  useEffect(() => {
    const fetchBannerImage = async () => {
      try {
        // Use no-store to bypass browser cache and always fetch fresh data
        const response = await fetch('/api/homepage-images', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        const data = await response.json();
        if (data.images?.banner) {
          setBannerImage(data.images.banner);
        }
        if (data.images?.bannerOpacity !== undefined) {
          setBannerOpacity(data.images.bannerOpacity);
        }
      } catch (error) {
        console.error('Error fetching banner image:', error);
      }
    };

    fetchBannerImage();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full h-[300px] sm:h-[450px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden bg-[#F5F5F1]">

        {bannerImage && (
          <Image 
            src={bannerImage} 
            alt="" 
            className="object-cover" 
            loading="eager"
            priority
            fill 
            sizes="100vw"
            quality={90}
            style={{ opacity: bannerOpacity / 100 }}
          />
        )}
        
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center"

        >
        <img src="/images/logo.png" alt="Logo" className="md:h-36 h-24 mt-5 md:mt-0"/>
          {/*<p className={`text-md sm:text-lg md:text-[16px] font-semibold mb-1 uppercase`}>
            Élégance et confort
          </p>*/}

          <h1 className={`${Zodiak.className} text-2xl sm:text-3xl md:text-4xl lg:text-[56px] font-normal mb-4`}>
          Créez votre refuge de tranquillité
          </h1>

          <Link href={'/meubles'} className={`${Sora.className} text-md sm:text-lg md:text-[16px] font-normal mb-4 underline hover:scale-[1.02] transition-transform duration-300`}>
            Découvrez nos meubles</Link>

        </div>

      </div>
    </div>
  );
};