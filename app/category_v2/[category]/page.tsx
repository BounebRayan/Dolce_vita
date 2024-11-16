'use client';

import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Range } from 'react-range';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Product {
  _id: string;
  productName: string;
  category: string;
  images: string[];
  mainImageNumber: number;
  onSale: boolean;
  price: number;
  unitsSold: number;
  createdAt: string;
}

const SubcategoryPage = () => {
  const params = useParams();
  const { category } = params;
  const categoryStr = Array.isArray(category) ? category[0] : category;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([0, 20000]);
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
            subcategory: categoryStr,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
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
  }, [categoryStr, priceRange, onSale, sortAttribute, sortOrder]);

  const decodedCategory = decodeURIComponent(categoryStr || '');

  const handleSortToggle = (attribute: string) => {
    if (sortAttribute === attribute) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortAttribute(attribute);
      setSortOrder('asc');
    }
  };

  if (loading) return <div className='mt-4 text-center'>Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row mx-4 sm:mx-8 lg:mx-12 mt-2">
      <aside className="w-full lg:w-1/6 pr-4 sm:border-r border-b sm:border-b-0 h-full mb-4 lg:mb-0">
        <h2 className="text-xl font-medium mb-2">Filtres</h2>

        <h3 className="font-medium mb-2">Plage de prix</h3>

        <div className='px-1 mb-4'>
          <Range
            step={1}
            min={0}
            max={20000}
            values={priceRange}
            onChange={setPriceRange}
            renderTrack={({ props, children }) => (
              <div {...props} className="h-1 bg-gray-300 mb-4">{children}</div>
            )}
            renderThumb={({ props }) => (
              <div {...props} className="h-4 w-2 bg-[#dcc174]" />
            )}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span>{priceRange[0]} DT</span>
          <span>{priceRange[1]} DT</span>
        </div>
        <div className='flex flex-row justify-between items-center'>
        <span className="cursor-pointer flex border flex-col justify-start border-black px-1">
          Min
    <input
      type="number"
      className="border-none w-32 outline-none"
      value={priceRange[0]}
      onChange={(e) => {
        const value = Number(e.target.value);
        // Default to min value of 0 if input is invalid or empty
        const newValue = isNaN(value) || value < 0 ? 0 : Math.min(value, priceRange[1]);
        setPriceRange([newValue, priceRange[1]]);
      }}
    />
  </span>
  <span className='text-2xl'>-</span>
  <span className="cursor-pointer flex flex-col border justify-start border-black px-1">
    Max
    <input
      type="number"
      className="border-none w-32 outline-none"
      value={priceRange[1]}
      onChange={(e) => {
        const value = Number(e.target.value);
        // Default to max value of 20000 if input is invalid or empty
        const newValue = isNaN(value) || value > 20000 ? 20000 : Math.max(value, priceRange[0]);
        setPriceRange([priceRange[0], newValue]);
      }}
    />
  </span>
        </div>
      </aside>

      <main className="w-full lg:w-3/4 pl-0 lg:pl-4">
        <h1 className="text-3xl lg:text-4xl font-light my-6 capitalize">{decodedCategory}</h1>

        <div className='flex items-center justify-between'><label className="flex items-center">
 
  <div
    className={`relative w-8 h-5 flex items-center rounded-full p-1 cursor-pointer ${
      onSale ? 'bg-[#dcc174]' : 'bg-gray-300'
    }`}
    onClick={() => setOnSale(!onSale)}
  >
    <div
      className={`w-3 h-3 bg-white rounded-full shadow-md transform duration-300 ${
        onSale ? 'translate-x-3' : ''
      }`}
    ></div>
  </div>
  <span className="ml-2 text-sm">En solde</span>
</label>
        <div className="relative mb-2 flex justify-end items-end">
          <div>
  <button
    onClick={() => setSortDropdownOpen(!isSortDropdownOpen)}
    className="flex items-center justify-between px-4 py-2 text-sm text-black w-44"
  >
    Trier par : {sortAttribute === 'price' ? 'Prix' : sortAttribute === 'createdAt' ? 'Nouveau' : 'Popularité'}
    {isSortDropdownOpen ? <FaChevronUp className="ml-1 w-[9px]" /> : <FaChevronDown className="ml-1 w-[9px]" />}
  </button>

  {isSortDropdownOpen && (
    <div className="absolute right-0 bg-white border border-gray-300 rounded-sm shadow-md z-10 w-44">
      <button onClick={() => handleSortOptionClick('unitsSold', 'desc')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
        Popularité
      </button>
      <button onClick={() => handleSortOptionClick('price', 'asc')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
        Prix croissant
      </button>
      <button onClick={() => handleSortOptionClick('price', 'desc')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
        Prix décroissant
      </button>
      <button onClick={() => handleSortOptionClick('createdAt', 'desc')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
        Nouveau
      </button>
    </div>
  )}
  </div>
</div></div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <Link key={product._id} href={`/product/${product._id}`}>
                <div className="cursor-pointer transform transition duration-300 hover:scale-105">
                  <img
                    src={product.images[0]}
                    alt={product.productName}
                    className="w-full h-[200px] sm:h-[250px] lg:h-[360px] object-cover rounded-sm"
                    loading='lazy'
                  />
                  <h3 className="mt-2 text-sm lg:text-[13px] font-bold">{product.productName}</h3>
                  <p className="text-sm text-gray-600">{product.price.toFixed(2)} DT</p>
                </div>
              </Link>
            ))
          ) : (
            <p>Aucun produit n’a été trouvé 😔</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubcategoryPage;
