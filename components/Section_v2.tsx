"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, ChevronRightIcon, ChevronLeftIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { PiShootingStarDuotone } from 'react-icons/pi';
import { IoHeartCircle } from 'react-icons/io5';
import { IoMdHeart } from 'react-icons/io';

type Product = {
  category: any;
  _id: string;
  reference: string;
  productName: string;
  price: number;
  images: string[];
  onSale :boolean;
  isRecommended: boolean;
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
    <section className="md:px-1 mb-3 group">
      {/* Section Name and Voir Tout */}
      <div className="flex flex-col items-start mb-1 mx-4 sm:mx-6 md:mx-11">
        <h2 className="text-xl md:text-2xl font-md">{prop.name}</h2>
        <Link href="/new" className="text-black text-sm underline mt-0.5">
          Tout Voir
        </Link>
      </div>

      {/* Loading Indicator */}
      {loading ? (
  <div className="relative sm:mx-6 md:mx-9 mx-1 flex space-x-2 overflow-x-auto scrollbar-hide scroll-smooth pt-3 pl-2">
    {[...Array(5)].map((_, index) => (
      <div 
        key={index} 
        className="relative flex-none w-[200px] sm:w-[250px] md:w-[300px] lg:w-[300px] h-[300px] bg-gray-200 animate-pulse rounded-lg"
      />
    ))}
  </div>
) :(
        <div className="relative sm:mx-6 md:mx-9 mx-1">
          {/* Left Button - Only visible on desktop screens */}
          <button
            className={`hidden lg:block absolute -left-6 border border-black top-[45%] disabled:hover:bg-white transform -translate-y-1/2 p-2 hover:bg-[#F6DB8D] bg-white z-40 shadow-lg shadow-slate-500 opacity-0 transition-opacity duration-300 ${isLeftButtonDisabled ? 'opacity-0' : 'group-hover:opacity-100'}`}
            onClick={() => { if (!isLeftButtonDisabled) handleScroll(-2*Item_width); }}
            disabled={isLeftButtonDisabled}
          >
            <ChevronLeftIcon className="h-6 w-6 text-black" />
          </button>

          {/* Products Grid - Scrollable on mobile, paginated on desktop */}
          <div
            className="flex space-x-2 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth pt-3 pl-2"
            style={{ maxHeight: '500px' }}
            ref={containerRef}
          >
            {products
              .map((product) => (
                <Link key={product._id} href={`/product/${product._id}`}>
                  <div className={` relative flex-none ${product.category  === 'Meubles' ? 'lg:w-[500px]' : 'lg:w-[300px]'} w-[200px] sm:w-[250px] md:w-[300px] cursor-pointer transform transition duration-300 hover:scale-[1.01] pb-3`}>
                    <img
                      src={product.images[0] || "https://placehold.co/600x400/F5F5F1/F5F5F1"}
                      alt={product.productName}
                      className="w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[380px] object-cover"
                      loading="lazy"
                    />
                    <h3 className="mt-1 text-[13px] sm:text-[14px] font-medium">{product.productName}</h3>
                    {product.category !== 'Meubles' && <p className="text-[13px] sm:text-[14px] text-gray-600">{product?.onSale ? <div>{(product.price * (1 - product.salePercentage / 100)).toFixed(0) } DT<span className="line-through text-gray-500 ml-2">{product.price.toFixed(0)} DT</span></div> : <div>{product?.price.toFixed(0)} DT</div> } </p>}
                    {product.isRecommended && <IoMdHeart  className="text-[#F6DB8D] drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.3)] text h-7 w-7 absolute top-4 right-4 rounded-full p-1"/>}
                  </div>
                </Link>
              ))}
          </div>

          {/* Right Button - Only visible on desktop screens */}
          <button
            className={`hidden lg:block absolute -right-6 border border-black p-2 top-[45%] hover:bg-[#F6DB8D] disabled:hover:bg-white transform -translate-y-1/2 bg-white z-40 shadow-md shadow-slate-500 opacity-0 transition-opacity duration-300 ${isRightButtonDisabled ? 'opacity-0' : 'group-hover:opacity-100'}`}
            onClick={() => { if (!isRightButtonDisabled) handleScroll(2*Item_width); }}
            disabled={!!isRightButtonDisabled}
          >
            <ChevronRightIcon className="h-6 w-6 text-black" />
          </button>
        </div>
      )}
    </section>
  );
}
