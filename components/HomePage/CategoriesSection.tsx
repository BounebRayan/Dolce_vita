'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';;
import localFont from 'next/font/local';
import { homepageCategories, type HomepageCategory } from '../../config/categories';

const myFont = localFont({
  src: [
    { path: '../../public/fonts/Zodiak/Zodiak-Thin.otf', weight: '100', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Light.otf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Zodiak/Zodiak-Bold.otf', weight: '700', style: 'normal' },
  ],
});

// Get categories from config
const categories = homepageCategories;

// Function to get the correct category key for mapping
const getCategoryKey = (link: string): string => {
  // Map specific complex paths to their correct keys
  const keyMap: {[key: string]: string} = {
    '/new': 'new',
    '/collections': 'collections',
    '/promos': 'promos',
    '/meubles': 'meubles',
    '/meubles/salons/canapes-fauteuils': 'canapes-fauteuils',
    '/meubles/salons/meubles-tv': 'meubles-tv',
    '/meubles/salles-a-manger': 'salles-a-manger',
    '/meubles/canapes-fauteuils': 'canapes-fauteuils',
    '/meubles/consoles-meubles-entree/consoles': 'consoles',
    '/meubles/consoles-meubles-entree/meubles-entree': 'meubles-entree',
    '/decorations': 'decorations',
    '/decorations/deco-accessoires': 'accessoires-deco',
    '/decorations/deco-accessoires/pieces artistiques': 'pieces-artistiques',
    '/decorations/deco-accessoires/vases': 'vases',
    '/decorations/deco-accessoires/statues': 'statues',
    '/decorations/deco-accessoires/cadres-photo': 'cadres-photo',
    '/decorations/bougies-parfums-interieur': 'bougies-parfums-interieur',
    '/decorations/miroirs': 'miroirs',
    '/decorations/decorations-murales': 'decorations-murales',
    '/decorations/luminaires': 'luminaires',
    '/decorations/plantes': 'plantes',
    '/decorations/art-de-la-table': 'art-de-la-table',
    '/decorations/linge-de-maison': 'linge-de-maison',
  };
  
  return keyMap[link] || link.split('/').pop() || link;
};

const CategoriesSection: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [categoryImages, setCategoryImages] = useState<{[key: string]: string}>({});
  const [categoryVisibility, setCategoryVisibility] = useState<{[key: string]: boolean}>({});
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [dataLoaded, setDataLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const Item_width=240;


  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const response = await fetch('/api/homepage-images');
        const data = await response.json();
        
        if (data.images?.categories) {
          setCategoryImages(data.images.categories);
        }
        
        if (data.images?.categoryVisibility) {
          setCategoryVisibility(data.images.categoryVisibility);
        }
        
        if (data.images?.categoryOrder) {
          setCategoryOrder(data.images.categoryOrder);
        }
        
        setDataLoaded(true);
      } catch (error) {
        console.error('Error fetching category images:', error);
        setDataLoaded(true);
      }
    };

    fetchCategoryImages();
  }, []);

  const handleScroll = (scrollAmount: number) => {
    if (containerRef.current) {
    const newScrollPosition = scrollPosition + scrollAmount;
    setScrollPosition(newScrollPosition);
    containerRef.current.scrollLeft = newScrollPosition;}
  }

  const handleImageError = (categoryId: string, imageSrc: string) => {
    // Only mark as error if it's a config image, not a dynamic image
    if (imageSrc.startsWith('/images/categories/')) {
      setImageErrors(prev => new Set(prev).add(categoryId));
    }
  }

  const handleImageLoad = (categoryId: string) => {
    setLoadedImages(prev => new Set(prev).add(categoryId));
  }
  const isLeftButtonDisabled = scrollPosition <= 0;
  const isRightButtonDisabled = containerRef.current && containerRef.current.scrollWidth <= containerRef.current.clientWidth + scrollPosition;
  
  // Calculate number of visible categories for loading state
  const visibleCategoriesCount = dataLoaded ? 
    categories.filter(category => {
      const categoryKey = getCategoryKey(category.link);
      return categoryVisibility[categoryKey] !== false;
    }).length : 6; // Default to 6 if data not loaded yet
  
  return (
    <section className="lg:px-1 pt-2 mt-3 mx-0 sm:mx-2 md:mx-4 mb-2">

      {/* Categories Title */}
      <div className="flex justify-between items-center mb-1 px-1 sm:px-2 lg:px-4">
        <h2 className={`${myFont.className} text-2xl font-light`}>Découvrez nos catégories</h2>
      </div>
  
      {/* Categories Content */}
      <div className="relative mx-0 sm:mx-2 lg:mx-2.5 group">

        {/* Scroll Left Button */}
        <button
          className={`hidden z-40 lg:block absolute -left-0 h-[45%] cursor-pointer disabled:cursor-default top-[47%] transform -translate-y-1/2 p-2 opacity-0 backdrop-blur-sm bg-black/25 hover:bg-black/40 rounded-l-sm transition-opacity duration-300 ${isLeftButtonDisabled ? 'opacity-0' : 'group-hover:opacity-100'}`}
          onClick={() => { if (!isLeftButtonDisabled) handleScroll(-2*Item_width); }}
          disabled={isLeftButtonDisabled}
        >
          <ChevronLeftIcon className="h-4 w-4 text-white"/>
        </button>
  
        {/* Categories Grid */}
        <div ref={containerRef} className="flex space-x-2 overflow-x-auto lg:overflow-hidden scroll-smooth scrollbar-hide p-2">
          {!dataLoaded ? (
            // Show loading placeholders for visible categories only
            Array.from({ length: 12 }).map((_, index) => (
              <div key={`loading-${index}`} className="flex-none w-[180px] sm:w-[210px] h-full pb-1">
                <div className="w-full h-64 sm:h-64 md:h-64 lg:h-64 bg-gray-200 rounded-sm flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Loading...</div>
                </div>
                <div className="h-4 bg-gray-200 rounded-sm mt-0.5"></div>
              </div>
            ))
          ) : (
            categories
              .sort((a, b) => {
                const aKey = getCategoryKey(a.link);
                const bKey = getCategoryKey(b.link);
                const aIndex = categoryOrder.indexOf(aKey);
                const bIndex = categoryOrder.indexOf(bKey);
                return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
              })
              .filter((category) => {
                const categoryKey = getCategoryKey(category.link);
                return categoryVisibility[categoryKey] !== false; // Default to visible
              })
              .map((category) => {
            const categoryKey = getCategoryKey(category.link);
            const dynamicImage = categoryImages[categoryKey];
            
            
            // Determine if we have a dynamic image to load
            const hasDynamicImage = dynamicImage && dynamicImage !== "https://placehold.co/1280x720/F5F5F1/F5F5F1";
            const isImageLoaded = loadedImages.has(category.id.toString());
            
            return (
              <Link key={category.id} href={`${category.link.toLowerCase()}`}>
                <div className="flex-none w-[180px] sm:w-[210px] cursor-pointer transform transition-transform hover:scale-[1.02] duration-300 h-full pb-1">
                  <div className="relative">
                    {/* Gray background - always visible */}
                    <div className="w-full h-64 sm:h-64 md:h-64 lg:h-64 bg-gray-200 rounded-sm flex items-center justify-center">
                      <div className="text-gray-400 text-sm">Loading...</div>
                    </div>
                    
                    {/* Dynamic image - fades in when loaded */}
                    {hasDynamicImage && (
                      <img
                        src={dynamicImage}
                        alt={category.name}
                        className={`absolute inset-0 w-full h-64 sm:h-64 md:h-64 lg:h-64 object-cover rounded-sm transition-opacity duration-700 ${
                          isImageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        loading="lazy"
                        onLoad={() => handleImageLoad(category.id.toString())}
                        onError={() => handleImageError(category.id.toString(), dynamicImage)}
                      />
                    )}
                  </div>
                  <h3 className="text-[13px] uppercase">{category.name}</h3>
                </div>
              </Link>
            );
          })
          )}
        </div>
  
        {/* Scroll Right Button */}
        <button
          className={`hidden z-40 lg:block disabled:bg-white absolute -right-0 h-[45%] cursor-pointer disabled:cursor-default top-[47%] transform -translate-y-1/2 p-2 opacity-0 backdrop-blur-sm bg-black/25 hover:bg-black/40 rounded-r-sm transition-opacity duration-300 ${isRightButtonDisabled ? 'opacity-0' : 'group-hover:opacity-100'}`}
          onClick={() => { if (!isRightButtonDisabled) handleScroll(2*Item_width); }}
          disabled={!!isRightButtonDisabled}
        >
          <ChevronRightIcon className="h-4 w-4 text-white"/>
        </button>

      </div>
    </section>
  );
}
  
export default CategoriesSection;