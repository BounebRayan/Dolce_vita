'use client';

import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';

const myFont = localFont({
  src: [
    { path: '../app/fonts/Zodiak/Zodiak-Thin.otf', weight: '100', style: 'normal' },
    { path: '../app/fonts/Zodiak/Zodiak-Light.otf', weight: '300', style: 'normal' },
    { path: '../app/fonts/Zodiak/Zodiak-Regular.otf', weight: '400', style: 'normal' },
    { path: '../app/fonts/Zodiak/Zodiak-Bold.otf', weight: '700', style: 'normal' },
  ],
});

const myFont2 = localFont({
  src: [
    { path: '../app/fonts/Clash/ClashDisplay-Light.otf', weight: '300', style: 'normal' },
    { path: '../app/fonts/Clash/ClashDisplay-Regular.otf', weight: '400', style: 'normal' },
    { path: '../app/fonts/Clash/ClashDisplay-Bold.otf', weight: '700', style: 'normal' },
  ],
});

const myFont3 = localFont({
  src: [
    { path: '../app/fonts/Satochi/Satoshi-Light.otf', weight: '300', style: 'normal' },
    { path: '../app/fonts/Satochi/Satoshi-Regular.otf', weight: '400', style: 'normal' },
    { path: '../app/fonts/Satochi/Satoshi-Bold.otf', weight: '700', style: 'normal' },
  ],
});

const myFont4 = localFont({
  src: [
    { path: '../app/fonts/Sora/Sora-Light.otf', weight: '300', style: 'normal' },
    { path: '../app/fonts/Sora/Sora-Regular.otf', weight: '400', style: 'normal' },
    { path: '../app/fonts/Sora/Sora-Bold.otf', weight: '700', style: 'normal' },
  ],
});

const myFont5 = localFont({
  src: [
    { path: '../app/fonts/Supreme/Supreme-Thin.otf', weight: '100', style: 'normal' },
    { path: '../app/fonts/Supreme/Supreme-Light.otf', weight: '300', style: 'normal' },
    { path: '../app/fonts/Supreme/Supreme-Regular.otf', weight: '400', style: 'normal' },
    { path: '../app/fonts/Supreme/Supreme-Bold.otf', weight: '700', style: 'normal' },
  ],
});


import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Banner() {
  return (
    <div className="flex items-center justify-center mx-4 sm:mx-6 lg:mx-[42px] mt-1 sm:mt-1.5">
      <div className="relative w-full h-[300px] sm:h-[450px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden">
        <Image
          src="/images/banner.jpg"
          alt="Banner Image"
          fill
          className="object-cover"
          loading='lazy'
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#C8C8C8]/60 text-center">

          <p className={` ${myFont3.className} text-md sm:text-lg md:text-[16px] font-semibold mb-1 uppercase`}>
            Élégance et confort
          </p>

          <h1 className={` ${myFont.className} text-2xl sm:text-3xl md:text-4xl lg:text-[56px] font-normal mb-4`}>
          Créez votre refuge de tranquillité
          </h1>

          <Link href={'/meubles'} className={` ${myFont4.className} text-md sm:text-lg md:text-[16px] font-normal mb-4 underline hover:scale-[1.02] transition-transform duration-300`}>
            Découvrez nos meubles</Link>

          {/*<Link href={'/meubles'} className="group/button relative inline-flex items-center justify-center overflow-hidden backdrop-blur-lg text-base transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-gray-600/50 border px-4 py-2 sm:px-6 sm:py-3 bg-[#F6DB8D]  border-black font-medium  gap-1">
            Découvrez nos Meubles<ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
              <div className="relative h-full w-10 bg-white/20"></div>
            </div>
          </Link>*/}

        </div>

      </div>
    </div>
  );
};