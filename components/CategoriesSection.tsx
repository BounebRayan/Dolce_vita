// components/CategoriesSection.tsx
"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { FaArrowRightLong, FaArrowLeftLong } from 'react-icons/fa6';

type Category = {
  id: number;
  link:string;
  name: string;
  image: string;
};

const categories: Category[] = [
  { id: 1, link:"salons", name: 'Salons', image: '/images/living.jpg' },
  { id: 2, link:"chambres", name: 'Chambres', image: '/images/bedroom2.jpg' },
  { id: 3, link:"salles à manger", name: 'Salles à manger', image: '/images/dining.jpg' },
  { id: 4, link:"accessoires déco", name: 'Accessoires déco', image: '/images/decor11.jpg' },
  { id: 5, link:"vases", name: 'Vases', image: '/images/decor12.jpg' },
  { id: 6, link:"bougies & parfums d'intérieur", name: "Bougies & parfums d'intérieur", image: '/images/parfum.jpg' },
  { id: 7, link:"luminaires",  name: 'Luminaires', image: '/images/lamp.jpg' },
  { id: 8, link:"miroirs",  name: 'Miroirs', image: '/images/miror.jpg' },
  { id: 9, link:"deco murale", name: 'Déco murale', image: '/images/wall.jpg' },
  { id: 10, link:"cadres photo", name: 'Cadres Photo', image: '/images/decor2.jpg' },
  { id: 11, link:"linges de maison", name: 'Linge de maison', image: '/images/linge.jpg' },
];

const CategoriesSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 9;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 3);
    }
  };

  const handleNext = () => {
    if (currentIndex < categories.length - itemsPerPage) {
      setCurrentIndex(currentIndex + 3);
    }
  };

  return (
    <section className="px-3 pt-2 mt-6 mx-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-md">Découvrez nos catégories</h2>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button
              className="p-1 disabled:opacity-50"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <FaArrowLeftLong />
            </button>
            <button
              className="p-1 disabled:opacity-50"
              onClick={handleNext}
              disabled={currentIndex >= categories.length - itemsPerPage}
            >
              <FaArrowRightLong />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-9 gap-3">
        {categories
          .slice(currentIndex, currentIndex + itemsPerPage)
          .map((category) => (
            <Link key={category.id} href={`/categories/${category.link.toLowerCase()}`}>
            <div className=" relative cursor-pointer transform transition duration-300 hover:scale-105">
              <img
                src={category.image}
                alt={category.name}
                className="w-[195px] h-[255px] rounded-sm object-cover mx-auto"
              />
              <h3 className="mt-2 text-md uppercase">{category.name}</h3>
            </div>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default CategoriesSection;