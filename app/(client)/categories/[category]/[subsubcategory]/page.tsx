'use client';

import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import CategoriesSection from '@/components/HomePage/CategoriesSection';
import InsideCategories from '@/components/ProductPage/InsideCategories';

interface Product {
  _id: string;
  productName: string;
  category: 'Meubles' | 'Déco';
  subCategory?: string;
  subSubCategory?: string;
  images: string[];
  mainImageNumber: number;
  onSale: boolean;
  price: number;
  unitsSold: number;
  createdAt: string;
  salePercentage: number;
}

const SubsubcategoryPage = () => {
  const params = useParams();
  const { category: categoryParam, subsubcategory: subsubcategoryParam } = params;
  const categoryStr = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;
  const subsubcategoryStr = Array.isArray(subsubcategoryParam) ? subsubcategoryParam[0] : subsubcategoryParam;
  
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/products/subcategory', {
          params: {
            subcategory: decodeURIComponent(categoryStr || ''),
            subsubcategory: decodeURIComponent(subsubcategoryStr || ''),
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

    if (categoryStr && subsubcategoryStr) {
      fetchProducts();
    }
  }, [categoryStr, subsubcategoryStr, onSale, sortAttribute, sortOrder]);

  // Determine grid layout based on the category of the first product
  const gridCols = products[0]?.category === 'Meubles' ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
  const aspect = products[0]?.category === 'Meubles' ? 'aspect-[6/4]' : 'aspect-[4/5]';

  return (
    <div className="flex flex-col lg:flex-row mx-4 sm:mx-8 lg:mx-[60px] mt-2 md:mt-3 mb-8">
      <main className="w-full pl-0 lg:pl-4">
      <InsideCategories type={products[0]?.category || 'Déco'}/>
      <div className='border-t mt-5 pt-5'></div>
        {products[0] && products[0].category === "Déco" && <div>
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
        </div>}

        {/* Product Grid with Conditional Loading Spinner */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 ${gridCols} gap-4`}>
          {loading ? (
            <div className="col-span-full text-center">Un instant, nous récupérons les articles...</div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <Link key={product._id} href={`/product/${product._id}`}>
                <div className="cursor-pointer transform transition duration-300 hover:scale-[1.02] rounded-sm pb-1">
                  <img
                    src={product.images[0]}
                    alt={product.productName}
                    className={`w-full object-cover rounded-sm ${aspect}`}	
                    loading="lazy"
                  />
                  <h3 className="mt-1 text-sm lg:text-[14px] font-medium">{product.productName}</h3>
                  {product.category === "Déco" && <p className="text-sm text-gray-600">{product?.onSale ? <div>{(product.price * (1 - product.salePercentage / 100)).toFixed(0) } DT<span className="line-through text-gray-500 ml-2">{product.price.toFixed(0)} DT</span></div> : <div>{product?.price.toFixed(0)} DT</div> } </p>}
                </div>
              </Link>
            ))
          ) : (
            <p className='text-center col-span-full'>Rien ici pour le moment... mais de belles pièces arrivent bientôt.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubsubcategoryPage;

