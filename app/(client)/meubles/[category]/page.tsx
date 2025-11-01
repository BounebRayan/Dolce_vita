'use client';

import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { categories } from '@/config/categories';

interface Product {
  _id: string;
  productName: string;
  category: 'Meubles' | 'Déco';
  subCategory?: string;
  images: string[];
  onSale: boolean;
  price: number;
  unitsSold: number;
  salePercentage: number;
}

const MeublesCategoryPage = () => {
  const params = useParams();
  const { category } = params;
  const categoryStr = decodeURIComponent(Array.isArray(category) ? category[0] : category);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Filter states
  const [onSale, setOnSale] = useState<boolean>(false);
  const [sortAttribute, setSortAttribute] = useState<string>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isSortDropdownOpen, setSortDropdownOpen] = useState(false);

  const handleSortOptionClick = (attribute: string, order: 'asc' | 'desc') => {
    setSortAttribute(attribute);
    setSortOrder(order);
    setSortDropdownOpen(false);
  };

  // Get category info
  const categoryInfo = categories.meuble.find(cat => cat.type === categoryStr);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/products/subcategory', {
          params: {
            category: 'Meubles',
            subcategory: categoryStr,
            onSale: onSale ? 'true' : 'false',
            sortAttribute,
            sortOrder,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryStr) {
      fetchProducts();
    }
  }, [categoryStr, onSale, sortAttribute, sortOrder]);

  // Subcategories for this category
  const subcategories = {
    'consoles-meubles-entree': ['meubles-entree', 'consoles']
  };

  const categorySubcategories = subcategories[categoryStr as keyof typeof subcategories] || [];

  return (
    <div className="mx-4 sm:mx-8 lg:mx-12 mt-1 md:mt-2">
      <main className="w-full pl-0 lg:pl-4">
        <h1 className="text-[28px] font-light mb-2">{categoryInfo?.text || categoryStr}</h1>
        
        {/* Subcategories */}
        {categorySubcategories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Sous-catégories</h2>
            <div className="flex flex-wrap gap-2">
              {categorySubcategories.map((sub) => (
                <Link
                  key={sub}
                  href={`/meubles/${categoryStr}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-sm text-sm transition-colors"
                >
                  {sub}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className='border-t mt-6 pt-3'></div>
        
        {/* Filters */}
        <div className="relative mb-2 flex justify-end items-end">
          <div>
            <button
              onClick={() => setSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center justify-between px-4 py-2 text-sm text-black w-52"
            >
              Trier par :{' '}
              {sortAttribute === 'price'
                ? sortOrder === 'asc'
                  ? 'Prix croissant'
                  : 'Prix décroissant'
                : sortAttribute === 'createdAt'
                ? 'Nouveau'
                : 'Popularité'}
              {isSortDropdownOpen ? (
                <FaChevronUp className="ml-1 w-[9px]" />
              ) : (
                <FaChevronDown className="ml-1 w-[9px]" />
              )}
            </button>

            {isSortDropdownOpen && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-sm shadow-md z-10 w-52">
                <button
                  onClick={() => handleSortOptionClick('unitsSold', 'desc')}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Popularité
                </button>
                <button
                  onClick={() => handleSortOptionClick('price', 'asc')}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Prix croissant
                </button>
                <button
                  onClick={() => handleSortOptionClick('price', 'desc')}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Prix décroissant
                </button>
                <button
                  onClick={() => handleSortOptionClick('createdAt', 'desc')}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Nouveau
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center">Loading products...</div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <Link key={product._id} href={`/product/${product._id}`}>
                <div className="cursor-pointer transform transition duration-300 hover:scale-[1.02] rounded-sm pb-1">
                  <img
                    src={product.images[0]}
                    alt={product.productName}
                    className="w-full object-cover rounded-sm aspect-[6/4]"
                    loading="lazy"
                  />
                  <h3 className="mt-1 text-sm lg:text-[14px] font-medium">{product.productName}</h3>
                </div>
              </Link>
            ))
          ) : (
            <p className='ml-2'>Aucun produit n'a été trouvé</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MeublesCategoryPage;
