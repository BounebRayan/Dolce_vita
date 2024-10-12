"use client";

import React, { useState, useEffect } from 'react';
import { FaArrowRightLong, FaArrowLeftLong } from 'react-icons/fa6';
import Link from 'next/link';

type Product = {
  _id:string,
  reference: string;
  productName: string;
  price: number;
  images: string[];
};

export default function Section() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4; // Number of products to display at once

  // Fetch data from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products?sort=createdDate&limit=10');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

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
    <section className="p-6 mx-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Nouveautés</h2>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-blue-500 hover:underline">
            Voir Plus
          </a>
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
              disabled={currentIndex >= products.length - itemsPerPage}
            >
              <FaArrowRightLong />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 overflow-hidden">
        {products
          .slice(currentIndex, currentIndex + itemsPerPage)
          .map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="text-center relative cursor-pointer transform transition duration-300 hover:scale-105">
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="w-full h-[320px] object-cover rounded-sm"
                />
                <div className="absolute top-3.5 right-3.5 bg-transparent/50 text-xs text-white py-1 px-3 rounded-sm border border-white">
                  New
                </div>
                <h3 className="mt-2 text-lg">{product.productName}</h3>
                <p className="mt-1 text-gray-600">{product.price.toFixed(2)}DT</p>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
};