'use client';

import React, { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import localFont from 'next/font/local';
import { categories } from '@/config/categories';

const myFont = localFont({
  src: [
    { path: '../../app/fonts/Zodiak/Zodiak-Thin.otf', weight: '100', style: 'normal' },
    { path: '../../app/fonts/Zodiak/Zodiak-Light.otf', weight: '300', style: 'normal' },
    { path: '../../app/fonts/Zodiak/Zodiak-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../app/fonts/Zodiak/Zodiak-Bold.otf', weight: '700', style: 'normal' },
  ],
});

interface InsideCategoriesProps {
  type: string;
}

const InsideCategories: React.FC<InsideCategoriesProps> = ({ type }) => {
  const params = useParams();
  const { category: currentCategoryParam } = params;
  const currentCategoryType = Array.isArray(currentCategoryParam) 
    ? decodeURIComponent(currentCategoryParam[0]) 
    : decodeURIComponent(currentCategoryParam || '');
  
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Get categories based on type (Meubles or Déco) - keep all categories in order and highlight current one
  const categoriesList = useMemo(() => {
    // Auto-detect section by checking if current category is in meuble or deco
    // Fallback to the type prop if current category is not found
    let section: 'meuble' | 'deco';
    
    if (currentCategoryType) {
      const isInMeuble = categories.meuble.some(cat => cat.type === currentCategoryType);
      const isInDeco = categories.deco.some(cat => cat.type === currentCategoryType);
      
      if (isInMeuble) {
        section = 'meuble';
      } else if (isInDeco) {
        section = 'deco';
      } else {
        // Fallback to type prop
        section = type === 'Meubles' ? 'meuble' : 'deco';
      }
    } else {
      // Fallback to type prop
      section = type === 'Meubles' ? 'meuble' : 'deco';
    }
    
    const categoryList = section === 'meuble' ? categories.meuble : categories.deco;
    
    // Keep all categories in the list with the same order
    return categoryList.map((cat, index) => ({
      id: index + 1,
      link: `/categories/${cat.type}`,
      name: cat.text,
      type: cat.type,
      isActive: cat.type === currentCategoryType
    }));
  }, [type, currentCategoryType]);

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
        <div ref={containerRef} className="flex space-x-2 overflow-x-auto scroll-smooth">
          {categoriesList.map((category) => (
            <Link key={category.id} href={category.link}>
              <div className={`flex-none rounded-sm border-[1.5px] py-2 px-3 cursor-pointer transform transition-transform hover:scale-[1.02] duration-300 h-full pb-1 ${
                category.isActive 
                  ? 'bg-[#F6DB8D] text-black border-black' 
                  : 'bg-white text-black border-gray-300'
              }`}>
                <h3 className={`text-[13px] uppercase whitespace-nowrap ${
                  category.isActive ? 'font-semibold' : ''
                }`}>{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
  
 
      </div>
    </section>
  );}
  

export default InsideCategories;
