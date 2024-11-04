'use client';

import Image from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Banner() {
  return (
    <div className="flex items-center justify-center mx-4 sm:mx-6 md:mx-10 mt-1">
      <div className="relative w-full h-[300px] sm:h-[450px] md:h-[600px] lg:h-[700px] xl:h-[800px] rounded-sm overflow-hidden">
        <Image
          src="/images/banner.jpg"
          alt="Banner Image"
          fill
          className="object-cover rounded-sm"
          priority
        />
        
        {/* Overlaid Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-[#C8C8C8]/60 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Trouvez vos meubles de rêve
          </h1>
          <button className="px-4 py-2 sm:px-6 sm:py-3 bg-[#dcc174] text-black border border-black font-medium rounded-sm hover:bg-[#b89f53] transition-colors duration-300 flex items-center gap-2">
            Découvrez nos Packs <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};
