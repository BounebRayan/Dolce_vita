'use client';

import Image from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Banner() {
  return (
    <div className="flex items-center justify-center mx-4 sm:mx-6 md:mx-[47px] mt-1.5">
      <div className="relative w-full h-[300px] sm:h-[450px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden">
        <Image
          src="/images/banner.jpg"
          alt="Banner Image"
          fill
          className="object-cover"
          priority
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-black bg-[#C8C8C8]/60 text-center">

          <p className="text-md sm:text-lg md:text-xl font-medium mb-1">
            Élégance et confort
          </p>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
          Créez votre refuge de tranquillité
          </h1>

          <Link href={'/meubles'} className="px-4 py-2 sm:px-6 sm:py-3 bg-[#F6DB8D] text-black border border-black font-medium hover:bg-[#dcc174] transition-colors duration-300 flex items-center gap-1">
            Découvrez nos Meubles<ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
          </Link>

        </div>

      </div>
    </div>
  );
};