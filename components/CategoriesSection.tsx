'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Playfair_Display, Jost, Raleway } from "next/font/google";

type Category = {
  id: number;
  link: string;
  name: string;
  image: string;
};

const categories: Category[] = [
  { id: 1, link: "salons", name: 'Meubles', image: '/images/living.jpg' },
  { id: 2, link: "accessoires déco", name: 'Accessoires déco', image: '/images/decor11.jpg' },
  { id: 3, link: "vases", name: 'Vases', image: '/images/decor12.jpg' },
  { id: 4, link: "bougies & parfums d'intérieur", name: "Bougies & parfums d'intérieur", image: '/images/parfum.jpg' },
  { id: 5, link: "luminaires", name: 'Luminaires', image: '/images/lamp.jpg' },
  { id: 6, link: "miroirs", name: 'Miroirs', image: '/images/miror.jpg' },
  { id: 7, link: "deco murale", name: 'Déco murale', image: '/images/wall.jpg' },
  { id: 8, link: "cadres photo", name: 'Cadres Photo', image: '/images/decor2.jpg' },
  { id: 9, link: "linges de maison", name: 'Linge de maison', image: '/images/linge.jpg' },
  { id: 10, link: "linges de maison", name: 'Porte-Bougies', image: '/images/linge.jpg' },
  { id: 11, link: "linges de maison", name: 'Art de la Table', image: '/images/linge.jpg' },
  { id: 12, link: "linges de maison", name: 'Statues', image: '/images/linge.jpg' },
  { id: 13, link: "linges de maison", name: 'Plantes', image: '/images/linge.jpg' },
];

const CategoriesSection: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const Item_width=240;

  const handleScroll = (scrollAmount: number) => {
    if (containerRef.current) {
    const newScrollPosition = scrollPosition + scrollAmount;
    setScrollPosition(newScrollPosition);
    containerRef.current.scrollLeft = newScrollPosition;}
  }
  const isLeftButtonDisabled = scrollPosition <= 0;
  const isRightButtonDisabled = containerRef.current && containerRef.current.scrollWidth <= containerRef.current.clientWidth + scrollPosition;
  
  return (
    <section className={`md:px-1 pt-2 mt-4 mx-0 sm:mx-6 md:mx-7`}>
      <div className="flex justify-between items-center mb-1 px-4">
        <h2 className="text-2xl">Découvrez nos catégories</h2>
      </div>
  
      {/* Categories Content */}
      <div className="relative mx-2 sm:mr-6 md:mr-6 group">
        {/* Scroll Left Button */}
        <button
          className={`hidden z-40 lg:block absolute -left-6 shadow-lg disabled:bg-white shadow-slate-500 border border-black cursor-pointer disabled:cursor-default top-[42%] transform -translate-y-1/2 p-2 disabled:hover:bg-white hover:bg-[#F6DB8D] bg-white  opacity-0  transition-opacity duration-300 ${isLeftButtonDisabled ? 'opacity-0' : 'group-hover:opacity-100'}`}
          onClick={() => { if (!isLeftButtonDisabled) handleScroll(-2*Item_width); }}
          disabled={isLeftButtonDisabled}
        >
          <ChevronLeftIcon className="h-6 w-6 text-black" />
        </button>
  
        {/* Categories Grid */}
        <div ref={containerRef} className="flex space-x-2 overflow-x-auto lg:overflow-hidden scroll-smooth scrollbar-hide p-2">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.link.toLowerCase()}`}>
              <div className="flex-none w-[180px] sm:w-[210px] cursor-pointer transform transition-transform hover:scale-[1.02] duration-300 h-full pb-1">
                <img
                  src={`${'https://placehold.co/180x210/F5F5F1/black?text=' + category.name}`}
                  alt={category.name}
                  className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover"
                  loading="lazy"
                />
                <h3 className="mt-1 text-[14px]  uppercase">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
  
        {/* Scroll Right Button */}
        <button
          className={`hidden z-40  shadow-lg shadow-slate-500 lg:block disabled:bg-white absolute -right-6 cursor-pointer disabled:cursor-default border border-black top-[42%] transform -translate-y-1/2 p-2 hover:bg-[#F6DB8D] bg-white opacity-0 transition-opacity duration-300 ${isRightButtonDisabled ? 'opacity-0' : 'group-hover:opacity-100'}`}
          onClick={() => { if (!isRightButtonDisabled) handleScroll(2*Item_width); }}
          disabled={!!isRightButtonDisabled}
        >
          <ChevronRightIcon className="h-6 w-6 text-black" />
        </button>
      </div>
    </section>
  );}
  

export default CategoriesSection;
