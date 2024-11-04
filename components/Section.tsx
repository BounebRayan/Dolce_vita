"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Product = {
  _id: string;
  reference: string;
  productName: string;
  price: number;
  images: string[];
};

type SectionProp = {
  name: string;
  url: string;
};

export default function Section(prop: SectionProp) {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  // Fetch data from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(prop.url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [prop.url]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  const handleNext = () => {
    if (currentIndex < products.length - itemsPerPage) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  return (
    <section className="px-3 mt-3">
      {/* Section Name and Voir Tout */}
      <div className="flex flex-col items-start mb-4 mx-10 px-2 pt-3">
        <h2 className="text-xl md:text-2xl font-md">{prop.name}</h2>
        <a href="#" className="text-black text-sm underline mt-0.5">
          Tout Voir
        </a>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-lg">Loading...</p>
        </div>
      ) : (
        <div className="relative mx-2">
          {/* Left Button */}
          <button
            className="absolute -left-1 top-[50%] transform -translate-y-1/2 p-1 disabled:opacity-50"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ArrowLeftIcon className="h-6 w-6 md:h-8 md:w-8 text-black" />
          </button>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mx-2 md:mx-6 lg:mx-10">
            {products
              .slice(currentIndex, currentIndex + itemsPerPage)
              .map((product) => (
                <Link key={product._id} href={`/product/${product._id}`}>
                  <div className="relative cursor-pointer transform transition duration-300 hover:scale-105">
                    <img
                      src={product.images[0] || "https://placehold.co/600x400/F5F5F1/F5F5F1"}
                      alt={product.productName}
                      className="w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover rounded-sm "
                      loading="lazy"
                    />
                    <h3 className="mt-2 text-[13px] sm:text-[14px] font-bold">{product.productName}</h3>
                    <p className="text-[13px] sm:text-[14px] text-gray-600">{product.price.toFixed(2)} DT</p>
                  </div>
                </Link>
              ))}
          </div>

          {/* Right Button */}
          <button
            className="absolute -right-1 top-[50%] transform -translate-y-1/2 p-1 disabled:opacity-50"
            onClick={handleNext}
            disabled={currentIndex >= products.length - itemsPerPage}
          >
            <ArrowRightIcon className="h-6 w-6 md:h-8 md:w-8 text-black" />
          </button>
        </div>
      )}
    </section>
  );
}
