'use client';

import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';

const Zodiak = localFont({
  src: [
    { path: '../app/fonts/Zodiak/Zodiak-Thin.otf', weight: '100', style: 'normal' },
    { path: '../app/fonts/Zodiak/Zodiak-Light.otf', weight: '300', style: 'normal' },
    { path: '../app/fonts/Zodiak/Zodiak-Regular.otf', weight: '400', style: 'normal' },
    { path: '../app/fonts/Zodiak/Zodiak-Bold.otf', weight: '700', style: 'normal' },
  ],
});

const Satoshi = localFont({
  src: [
    { path: '../app/fonts/Satochi/Satoshi-Light.otf', weight: '300', style: 'normal' },
    { path: '../app/fonts/Satochi/Satoshi-Regular.otf', weight: '400', style: 'normal' },
    { path: '../app/fonts/Satochi/Satoshi-Bold.otf', weight: '700', style: 'normal' },
  ],
});

const Sora = localFont({
  src: [
    { path: '../app/fonts/Sora/Sora-Light.otf', weight: '300', style: 'normal' },
    { path: '../app/fonts/Sora/Sora-Regular.otf', weight: '400', style: 'normal' },
    { path: '../app/fonts/Sora/Sora-Bold.otf', weight: '700', style: 'normal' },
  ],
});

export default function Banner() {
  return (
    <div className="flex items-center justify-center mx-4 sm:mx-6 lg:mx-[42px] mt-1 sm:mt-1.5">
      <div className="relative w-full h-[300px] sm:h-[450px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden">

        <Image src="/images/banner.jpg" alt="Banner Image" className="object-cover" loading='lazy' fill/>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#C8C8C8]/60 text-center">

          <p className={`${Satoshi.className} text-md sm:text-lg md:text-[16px] font-semibold mb-1 uppercase`}>
            Élégance et confort
          </p>

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