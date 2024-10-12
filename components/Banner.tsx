'use client';

import Image from 'next/image';

export default function Banner(){
  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative w-[1500px] h-[800px]">
        <Image
          src="/images/banner.jpg"
          alt="Banner Image"
          fill
          style={{ objectFit: 'cover' }}
        />
        {/* Texte superposé */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-5xl font-bold mb-4">Découvrez vos meubles de rêve</h1>
          <p className="text-2xl mb-6">Achetez les meilleures sélections de meubles pour la maison dès aujourd'hui !</p>
          <button className="px-6 py-3 bg-[#dcc174] text-black font-medium rounded-md hover:bg-[#b89f53] transition-colors duration-300">
            Voir nos produits
          </button>
        </div>
      </div>
    </div>
  );
};

