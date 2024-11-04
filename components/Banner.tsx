'use client';

import Image from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Banner(){
  return (
    <div className="flex items-center justify-center mx-10 mt-1">
      <div className="relative w-[2000px] h-[800px] rounded-sm overflow-hidden">
        <Image
          src="/images/banner.jpg"
          alt="Banner Image"
          width={2400}
          height={1800}
          className="object-cover rounded-sm"
        />
        {/* Texte superposé */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-[#C8C8C8] text-center">
          <h1 className="text-5xl font-bold mb-4">Trouvez vos meubles de rêve</h1>
          <button className="px-6 py-3 bg-[#dcc174] text-black border border-black font-medium rounded-sm hover:bg-[#b89f53] transition-colors duration-300 flex items-center gap-2">
          Découvrez nos Packs <ChevronRightIcon className="h-5 w-5 text-black"/>
          </button>
        </div>
      </div>
    </div>
  );
};

