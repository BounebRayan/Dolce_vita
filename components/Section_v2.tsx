"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, ChevronRightIcon, ChevronLeftIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Product = {
  _id: string;
  reference: string;
  productName: string;
  price: number;
  images: string[];
  onSale :boolean;
  salePercentage : number;
};

type SectionProp = {
  name: string;
  url: string;
};

export default function Section(prop: SectionProp) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const Item_width=320;
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

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

  const handleScroll = (scrollAmount: number) => {
    if (containerRef.current) {

    const newScrollPosition = scrollPosition + scrollAmount;
    setScrollPosition(newScrollPosition);
    containerRef.current.scrollLeft = newScrollPosition;}
  }
  const isLeftButtonDisabled = scrollPosition <= 0;
  const isRightButtonDisabled = containerRef.current && containerRef.current.scrollWidth <= containerRef.current.clientWidth + scrollPosition;
  

  return (
    <section className="px-1 mt-1">
      {/* Section Name and Voir Tout */}
      <div className="flex flex-col items-start mb-3 mx-4 sm:mx-6 md:mx-10 sm:px-2  pt-3">
        <h2 className="text-xl md:text-2xl font-md">{prop.name}</h2>
        <Link href="/new" className="text-black text-sm underline mt-0.5">
          Tout Voir
        </Link>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-lg">Loading...</p>
        </div>
      ) : (
        <div className="relative mx-2 sm:mx-6 md:mx-10 px-2">
          {/* Left Button - Only visible on desktop screens */}
          <button
            className="hidden lg:block absolute -left-3 border border-black top-[50%]  disabled:hover:bg-white transform -translate-y-1/2 p-2 hover:bg-[#dcc174]  disabled:opacity-20 rounded-sm bg-white z-40 shadow-lg shadow-slate-500"
            onClick={() => { if (!isLeftButtonDisabled) handleScroll(-Item_width); }}
            disabled={isLeftButtonDisabled}
          >
            <ChevronLeftIcon className="h-6 w-6 text--black" />
          </button>

          {/* Products Grid - Scrollable on mobile, paginated on desktop */}
          <div
            className="flex space-x-4 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
            style={{ maxHeight: '450px' }}
            ref={containerRef}
          >
            {products
              .map((product) => (
                <Link key={product._id} href={`/product/${product._id}`}>
                  <div className="flex-none w-[200px] sm:w-[250px] md:w-[300px] cursor-pointer transform transition duration-300 hover:scale-105 pb-6">
                    <img
                      src={product.images[0] || "https://placehold.co/600x400/F5F5F1/F5F5F1"}
                      alt={product.productName}
                      className="w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover rounded-sm "
                      loading="lazy"
                    />
                    <h3 className="mt-1 text-[13px] sm:text-[14px] font-medium">{product.productName}</h3>
                    <p className="text-[13px] sm:text-[14px] text-gray-600">{product?.onSale ? (product.price * (1 - product.salePercentage / 100)).toFixed(0): product?.price.toFixed(0)} DT</p>
                  </div>
                </Link>
              ))}
          </div>

          {/* Right Button - Only visible on desktop screens */}
          <button
            className="hidden lg:block absolute -right-0.5 border border-black p-2 top-[50%] hover:bg-[#dcc174] disabled:hover:bg-white transform -translate-y-1/2 disabled:opacity-20 bg-white z-40 shadow-md rounded-sm shadow-slate-500"
            onClick={() => { if (!isRightButtonDisabled) handleScroll(Item_width); }}
            disabled={!!isRightButtonDisabled}
          >
            <ChevronRightIcon className="h-6 w-6 text-black" />
          </button>
        </div>
      )}
    </section>
  );
}
