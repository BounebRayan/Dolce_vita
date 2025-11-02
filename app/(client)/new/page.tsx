"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';

type Product = {
  salePercentage: number;
  onSale: any;
  _id: string;
  productName: string;
  category: 'Meubles' | 'Déco';
  price: number;
  images: string[];
  mainImageNumber: number;
  brand?: string;
  isPurchasable?: boolean;
};

const NewPage = () => {
  const [meublesProducts, setMeublesProducts] = useState<Product[]>([]);
  const [decoProducts, setDecoProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<'Meubles' | 'Déco'>('Meubles');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch 8 latest Meubles products
        const meublesResponse = await fetch(`/api/products?sort=createdAt&limit=8&category=Meubles`);
        if (!meublesResponse.ok) throw new Error('Failed to fetch Meubles');
        const meublesData = await meublesResponse.json();
        setMeublesProducts(meublesData);

        // Fetch 8 latest Déco products
        const decoResponse = await fetch(`/api/products?sort=createdAt&limit=8&category=Déco`);
        if (!decoResponse.ok) throw new Error('Failed to fetch Déco');
        const decoData = await decoResponse.json();
        setDecoProducts(decoData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const ProductSection = ({ 
    products, 
    title, 
    category 
  }: { 
    products: Product[]; 
    title: string; 
    category: 'Meubles' | 'Déco' 
  }) => {
    const gridCols = category === 'Meubles' ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
    const aspect = category === 'Meubles' ? 'aspect-[6/4]' : 'aspect-[4/5]';

    if (loading) {
      return (
        <div className="mb-12">
          <p className="text-center text-lg">Un instant, nous récupérons les derniers ajouts...</p>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="mb-12">
          <p className="text-center">Rien ici pour le moment... mais de belles pièces arrivent bientôt.</p>
        </div>
      );
    }

    return (
      <div className="mb-12">
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 ${gridCols} gap-4`}>
          {products.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="cursor-pointer transform transition duration-300 hover:scale-[1.02] rounded-sm pb-1">
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className={`w-full object-cover rounded-sm ${aspect}`}
                  loading="lazy"
                />
                <h3 className="mt-1 text-sm lg:text-[14px] font-medium">{product.productName}</h3>
                {product.category === "Meubles" && product.brand && (
                  <p className="text-xs lg:text-[12px] text-gray-500">{product.brand}</p>
                )}
                {(product.category === "Déco" || (product.category === "Meubles" && product.isPurchasable)) && (
                  <p className="text-sm text-gray-600">
                    {product?.onSale ? (
                      <div>
                        {(product.price * (1 - product.salePercentage / 100)).toFixed(0)} DT
                        <span className="line-through text-gray-500 ml-2">
                          {product.price.toFixed(0)} DT
                        </span>
                      </div>
                    ) : (
                      <div>{product?.price.toFixed(0)} DT</div>
                    )}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const currentProducts = activeCategory === 'Meubles' ? meublesProducts : decoProducts;

  return (
    <div className="mx-4 sm:mx-8 lg:mx-[80px] mt-3 mb-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-5">
      <div className="flex flex-col mb-4 lg:mb-0">
      <h1 className="text-[28px] capitalize font-semibold">Nos derniers ajouts</h1>
      <p className="text-gray-600">
       Découvrez les nouveautés de notre collection d'intérieur.
      </p>
      </div>
      {/* Category Toggle Switch */}
      <div className="flex items-center gap-4">
        {/* Toggle Switch Container - Fixed height container for perfect alignment */}
        <div className="flex items-center h-7">
          <button
            onClick={() => setActiveCategory(activeCategory === 'Meubles' ? 'Déco' : 'Meubles')}
            className="relative w-14 h-7 rounded-full border-[1.5px] border-[#F6DB8D] cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F6DB8D] focus:ring-offset-2"
            style={{
              backgroundColor: activeCategory === 'Meubles' ? '#F6DB8D' : 'white'
            }}
            aria-label="Toggle category"
            type="button"
          >
            {/* Toggle Slider - Precisely positioned */}
            <span
              className={`absolute top-[2px] left-[2px] w-[22px] h-[22px] bg-black rounded-full transition-transform duration-300 ease-in-out shadow-sm ${
                activeCategory === 'Déco' ? 'translate-x-[28px]' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        {/* Labels - Aligned with toggle using same height */}
        <div className="flex items-center h-7 gap-3">
          <button
            onClick={() => setActiveCategory('Meubles')}
            className={`text-sm uppercase whitespace-nowrap transition-colors duration-300 leading-none ${
              activeCategory === 'Meubles'
                ? 'font-semibold text-black'
                : 'font-normal text-gray-500 hover:text-black'
            }`}
            type="button"
          >
            Meubles
          </button>
          <span className="text-gray-400 leading-none">/</span>
          <button
            onClick={() => setActiveCategory('Déco')}
            className={`text-sm uppercase whitespace-nowrap transition-colors duration-300 leading-none ${
              activeCategory === 'Déco'
                ? 'font-semibold text-black'
                : 'font-normal text-gray-500 hover:text-black'
            }`}
            type="button"
          >
            Décorations
          </button>
        </div>
      </div>
      </div>
      <div className='border-t pt-5'></div>
      <ProductSection 
        products={currentProducts} 
        title={activeCategory} 
        category={activeCategory} 
      />
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<p className="text-center text-lg">Un instant, nous récupérons les derniers ajouts...</p>}>
      <NewPage />
    </Suspense>
  );
};

export default Page;
