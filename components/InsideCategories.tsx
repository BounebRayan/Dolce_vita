'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import localFont from 'next/font/local';

const myFont = localFont({
  src: [
    { path: '../app/fonts/Zodiak/Zodiak-Thin.otf', weight: '100', style: 'normal' },
    { path: '../app/fonts/Zodiak/Zodiak-Light.otf', weight: '300', style: 'normal' },
    { path: '../app/fonts/Zodiak/Zodiak-Regular.otf', weight: '400', style: 'normal' },
    { path: '../app/fonts/Zodiak/Zodiak-Bold.otf', weight: '700', style: 'normal' },
  ],
});

type Category = {
  id: number;
  link: string;
  name: string;
  image: string;
};

const categoriesdeco: Category[] = [
  { id: 2, link: "/categories/accessoires déco", name: 'Accessoires déco', image: '/images/categories/accesoires.jpg' },
  { id: 3, link: "/categories/vases", name: 'Vases', image: '/images/categories/vases.jpg' },
  { id: 4, link: "/categories/bougies & parfums d'intérieur", name: "Bougies & parfums d'intérieur", image: '/images//categories/bougie.jpg' },
  { id: 5, link: "/categories/luminaires", name: 'Luminaires', image: '/images/categories/luminaires.jpg' },
  { id: 6, link: "/categories/miroirs", name: 'Miroirs', image: '/images/categories/mirroirs.jpg' },
  { id: 7, link: "/categories/deco murale", name: 'Déco murale', image: '/images/categories/mur.jpg' },
  { id: 8, link: "/categories/cadres photo", name: 'Cadres Photo', image: '/images/categories/cadres.jpg' },
  { id: 9, link: "/categories/linges de maison", name: 'Linge de maison', image: '/images/categories/linge_de_maison.jpg' },
  { id: 10, link: "/categories/linges de maison", name: 'Porte-Bougies', image: '/images/categories/porte.jpg' },
  { id: 11, link: "/categories/linges de maison", name: 'Art de la Table', image: '/images/categories/art_de_table.jpg' },
  { id: 12, link: "/categories/linges de maison", name: 'Statues', image: '/images/categories/figure.jpg' },
  { id: 13, link: "/categories/linges de maison", name: 'Plantes', image: '/images/categories/plantes.jpg' },

];
const categoriesmeuble: Category[] = [
  { id: 2, link: "/categories/Salons", name: 'Salons', image: '/images/categories/accesoires.jpg' },
  { id: 3, link: "/categories/Salles à Manger", name: 'Salles a manges', image: '/images/categories/vases.jpg' },
  { id: 4, link: "/categories/Chambres", name: "Chambres", image: '/images//categories/bougie.jpg' },
  { id: 5, link: "/categories/Canapés & Fauteuils", name: 'Canapés & Fauteuils', image: '/images/categories/luminaires.jpg' },
  { id: 5, link: "/categories/Meubles TV", name: 'Meubles TV', image: '/images/categories/luminaires.jpg' },
  { id: 5, link: "/categories/Tables basses & Tables de coin", name: 'Tables basses & Tables de coin', image: '/images/categories/luminaires.jpg' },
  { id: 5, link: "/categories/Consoles & Meubles d’Entrée", name: 'Consoles & Meubles d’Entrée', image: '/images/categories/luminaires.jpg' },

];
interface InsideCategoriesProps {
  type: string;
}

const InsideCategories: React.FC<InsideCategoriesProps> = ({ type }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const categories = type === 'Meubles' ? categoriesmeuble : categoriesdeco;

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
    <section>
  
      {/* Categories Content */}
      <div className="relative group">
  
        {/* Categories Grid */}
        <div ref={containerRef} className="flex space-x-2 overflow-x-auto lg:overflow-hidden scroll-smooth scrollbar-hide">
          {categories.map((category) => (
            <Link key={category.id}  href={`${category.link.toLowerCase()}`}>
              <div className="flex-none rounded-sm border-[1.5px] py-2 px-3 cursor-pointer transform transition-transform hover:scale-[1.02] duration-300 h-full pb-1">
                <h3 className=" text-[13px] uppercase whitespace-nowrap ">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
  
 
      </div>
    </section>
  );}
  

export default InsideCategories;
