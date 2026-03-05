"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, ChevronRightIcon, ChevronLeftIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { PiShootingStarDuotone } from 'react-icons/pi';
import { IoHeartCircle } from 'react-icons/io5';
import { IoMdHeart } from 'react-icons/io';
import localFont from 'next/font/local';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary';

const myFont = localFont({
  src: [
    { path: '../../public/fonts/Zodiak/Zodiak-Thin.otf', weight: '100', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Light.otf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Bold.otf', weight: '700', style: 'normal' },
  ],
});


type Product = {
  category: any;
  _id: string;
  reference: string;
  productName: string;
  price: number;
  variants?: Array<{ label: string; price: number; isAvailable: boolean }>;
  images: string[];
  onSale :boolean;
  isRecommended: boolean;
  salePercentage : number;
  brand?: string;
  isPurchasable?: boolean;
};

type SectionProp = {
  name: string;
  url: string;
};

function ProductCard({ product }: { product: Product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isHovered && product.images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentImageIndex(0);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered, product.images.length]);

  return (
    <div
      className={`relative flex-none ${product.category === 'Meubles' ? 'lg:w-[500px]' : 'lg:w-[300px]'} w-[200px] sm:w-[250px] md:w-[300px] cursor-pointer transform transition duration-300 hover:scale-[1.01] pb-3`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[380px] overflow-hidden rounded-sm">
        {product.images.length > 0 ? (
          product.images.map((img, idx) => (
            <img
              key={idx}
              src={optimizeCloudinaryUrl(img) || "https://placehold.co/600x400/F5F5F1/F5F5F1"}
              alt={product.productName}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
            />
          ))
        ) : (
          <img
            src="https://placehold.co/600x400/F5F5F1/F5F5F1"
            alt={product.productName}
            className="w-full h-full object-cover"
          />
        )}
        {product.images.length > 1 && isHovered && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {product.images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <h3 className="mt-1 text-[13px] sm:text-[14px] font-medium">{product.productName}</h3>
      {product.category === 'Meubles' && product.brand && (
        <p className="text-[12px] sm:text-[13px] text-gray-500">{product.brand}</p>
      )}
      {(product.category === 'Déco' || (product.category === 'Meubles' && product.isPurchasable)) && (
        <p className="text-[13px] sm:text-[14px] text-gray-600">
          {(() => {
            const hasVariants = product.variants && product.variants.length > 0;
            const displayPrice = hasVariants
              ? Math.min(...product.variants!.map(v => v.price))
              : product.price;
            const prefix = hasVariants ? 'À partir de ' : '';
            if (product.onSale) {
              return <span>{prefix}{(displayPrice * (1 - product.salePercentage / 100)).toFixed(0)} DT<span className="line-through text-gray-500 ml-2">{displayPrice.toFixed(0)} DT</span></span>;
            }
            return <span>{prefix}{displayPrice.toFixed(0)} DT</span>;
          })()}
        </p>
      )}
      {product.isRecommended && <IoMdHeart className="text-[#F6DB8D] animate-bounce drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.3)] text h-7 w-7 absolute top-4 right-4 rounded-full p-1"/>}
    </div>
  );
}

export default function ProductsSection(prop: SectionProp) {
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
    <section className="lg:px-1 pt-2 mt-2 mx-0 sm:mx-2 lg:mx-4 mb-1 group">
      {/* Section Name and Voir Tout */}
      <div className="flex flex-col items-start mb-0.5 mx-2 sm:mx-2 lg:mx-4">
        <h2 className={` ${myFont.className} text-2xl font-light`}>{prop.name}</h2>
        <Link href="/new" className="text-black text-sm underline ">
          Tout Voir
        </Link>
      </div>

      {/* Loading Indicator */}
      {loading ? (
  <div className="relative sm:mx-2 md:mx-4 mx-1 flex space-x-2.5 overflow-x-auto scrollbar-hide scroll-smooth pt-3">
    {[...Array(7)].map((_, index) => (
      <div 
        key={index} 
        className="relative flex-none w-[200px] sm:w-[250px] md:w-[300px] lg:w-[300px] cursor-pointer transform transition duration-300 pb-3"
      >
        {/* Image placeholder */}
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[380px] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-md overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
        
        {/* Product name placeholder */}
        <div className="mt-1 h-4 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
        
        {/* Price placeholder */}
        <div className="mt-1 h-4 w-1/3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
      </div>
    ))}
  </div>
) :(
        <div className="relative sm:mx-2 md:mx-4 mx-1">
          {/* Left Button - Only visible on desktop screens */}
          <button
            className={`hidden z-40 lg:block absolute -left-2 h-[45%] cursor-pointer disabled:cursor-default top-[47%] transform -translate-y-1/2 p-2 opacity-0 backdrop-blur-sm bg-black/25 hover:bg-black/40 rounded-l-sm transition-opacity duration-300 ${isLeftButtonDisabled ? 'opacity-0' : 'group-hover:opacity-100'}`}
            onClick={() => { if (!isLeftButtonDisabled) handleScroll(-2*Item_width); }}
            disabled={isLeftButtonDisabled}
          >
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </button>

          {/* Products Grid - Scrollable on mobile, paginated on desktop */}
          <div
            className="flex space-x-2.5 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth pt-3 -ml-1 pl-2 mr-1 lg:-ml-2 lg:pl-2 lg:mr-0"
            style={{ maxHeight: '500px' }}
            ref={containerRef}
          >
            {products.map((product) => (
              <Link key={product._id} href={`/product/${product._id}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
          {/* Right Button - Only visible on desktop screens */}
          <button
          className={`hidden z-40 lg:block disabled:bg-white absolute -right-0 h-[45%] cursor-pointer disabled:cursor-default top-[47%] transform -translate-y-1/2 p-2 opacity-0 backdrop-blur-sm bg-black/25 hover:bg-black/40 rounded-r-sm transition-opacity duration-300 ${isRightButtonDisabled ? 'opacity-0' : 'group-hover:opacity-100'}`}
          onClick={() => { if (!isRightButtonDisabled) handleScroll(2*Item_width); }}
            disabled={!!isRightButtonDisabled}
          >
            <ChevronRightIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      )}
    </section>
  );
}
