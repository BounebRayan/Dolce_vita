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
  { id: 1, link:"salon", name: 'Salons', image: '/images/living.jpg' },
  { id: 2, link:"Chambre", name: 'Chambres à coucher', image: '/images/bedroom2.jpg' },
  { id: 3, link:"Cuisine", name: 'Salles à manger', image: '/images/dining.jpg' },
  { id: 4, link:"Lamp",  name: 'Lampes', image: '/images/lamp.jpg' },
  { id: 5, link:"Decor", name: 'Décoration', image: '/images/decoration.jpg' },
  { id: 6, link:"Wall", name: 'Décoration murale', image: '/images/wall.jpg' },
];

const CategoriesSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < categories.length - itemsPerPage) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <section className="p-6 mt-6 mx-52 border-t-[1.5px] border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-md">Catégories</h2>
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

      <div className="grid grid-cols-6 gap-3 overflow-hidden">
        {categories
          .slice(currentIndex, currentIndex + itemsPerPage)
          .map((category) => (
            <Link key={category.id} href={`/categories/${category.link}`}>
            <div className="text-center relative cursor-pointer transform transition duration-300 hover:scale-105">
              <img
                src={category.image}
                alt={category.name}
                className="w-[200px] h-[200px] rounded-sm object-cover mx-auto"
              />
              <h3 className="mt-2 text-lg">{category.name}</h3>
            </div>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default CategoriesSection;