'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { Range } from 'react-range';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

type Product = {
  _id: string;
  productName: string;
  price: number;
  images: string[];
  mainImageNumber: number;
  onSale: boolean;
  unitsSold: number;
  createdAt: string;
};

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [searchTerm, setSearchTerm] = useState<string>(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([0, 20000]);
  const [onSale, setOnSale] = useState<boolean>(false);

  // Sorting states
  const [sortAttribute, setSortAttribute] = useState<string>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/products/search?query=${encodeURIComponent(query)}&priceMin=${priceRange[0]}&priceMax=${priceRange[1]}&onSale=${onSale}&sort=${sortAttribute}&order=${sortOrder}`
        );
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      setSearchTerm(query);
      fetchData();
    }
  }, [query, priceRange, onSale, sortAttribute, sortOrder]);

  const handleSortToggle = (attribute: string) => {
    if (sortAttribute === attribute) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortAttribute(attribute);
      setSortOrder('asc');
    }
  };

  return (
    <section className="flex flex-col lg:flex-row px-6 mx-4 sm:mx-12 py-4 pt-2">
      {/* Filter Section */}
      <aside className="w-full lg:w-1/6 pr-4 sm:border-r border-b sm:border-b-0 h-full mb-4 lg:mb-0">
        <h2 className="text-xl font-medium mb-2">Filtres</h2>

        <h3 className="font-medium mb-2">Plage de prix</h3>
        <div className="px-1">
          <Range
            step={1}
            min={0}
            max={20000}
            values={priceRange}
            onChange={setPriceRange}
            renderTrack={({ props, children }) => (
              <div {...props} className="h-1 bg-gray-300 mb-4">
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div {...props} className="h-4 w-2 bg-[#dcc174]" />
            )}
          />
        </div>
        <div className="flex justify-between text-sm">
  <span className="cursor-pointer">
    <input
      type="number"
      className="border-none p-0 w-14 outline-none"
      value={priceRange[0]}
      onChange={(e) => {
        const value = Number(e.target.value);
        // Default to min value of 0 if input is invalid or empty
        const newValue = isNaN(value) || value < 0 ? 0 : Math.min(value, priceRange[1]);
        setPriceRange([newValue, priceRange[1]]);
      }}
    /> DT
  </span>
  <span className="cursor-pointer border border-b">
    <input
      type="number"
      className="border-none p-0 w-14 outline-none"
      value={priceRange[1]}
      onChange={(e) => {
        const value = Number(e.target.value);
        // Default to max value of 20000 if input is invalid or empty
        const newValue = isNaN(value) || value > 20000 ? 20000 : Math.max(value, priceRange[0]);
        setPriceRange([priceRange[0], newValue]);
      }}
    /> DT
  </span>
</div>

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={onSale}
            onChange={() => setOnSale(!onSale)}
            className="mr-2"
          />
          En solde
        </label>
      </aside>

      {/* Product and Sort Section */}
      <main className="w-full lg:w-3/4 pl-0 lg:pl-4">
        <h2 className="text-2xl font-md mb-4">Résultats de recherche pour: "{searchTerm}"</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {['price', 'date', 'unitsSold'].map((attribute) => (
            <button
              key={attribute}
              onClick={() => handleSortToggle(attribute)}
              className={`px-3 py-1 text-sm font-medium rounded-sm ${sortAttribute === attribute ? 'bg-gray-200' : 'bg-gray-100'}`}
            >
              {attribute === 'price' ? 'Prix' : attribute === 'date' ? 'Date' : 'Ventes'}
              {sortAttribute === attribute && (
                sortOrder === 'asc' ? <FaArrowUp className="inline ml-1" /> : <FaArrowDown className="inline ml-1" />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <Link key={product._id} href={`/product/${product._id}`} className="cursor-pointer transform transition duration-300 hover:scale-105">
                  <div>
                    <Image
                      src={product.images[product.mainImageNumber - 1] || '/fallback-image.jpg'}
                      alt={product.productName}
                      width={360}
                      height={360}
                      className="w-full h-60 rounded-sm object-cover mx-auto"
                      loading="lazy"
                    />
                    <h3 className="mt-2 text-[13px] sm:text-[14px] font-bold">{product.productName}</h3>
                    <p className="text-[13px] sm:text-[14px] text-gray-600">{product.price} DT</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-center text-lg">Aucun produit n’a été trouvé, essayez d’utiliser un autre terme 😔</p>
              </div>
            )}
          </div>
        )}
      </main>
    </section>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<p className="text-center text-lg">Loading search results...</p>}>
      <SearchPage />
    </Suspense>
  );
};

export default Page;
