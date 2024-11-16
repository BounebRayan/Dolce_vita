'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaChevronUp, FaArrowUp, FaArrowDown } from 'react-icons/fa';

type Product = {
  salePercentage: number;
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

  // Filter and Sort states
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

  return (
    <section className="flex flex-col lg:flex-row px-6 mx-4 sm:mx-12 py-4 pt-3">
      <main className="w-full pl-0 lg:pl-4">
        <h2 className="text-2xl font-light mb-2">Résultats de recherche pour: "{searchTerm}"</h2>

        <div className='flex items-center justify-between mb-4'>
          {/* On Sale Toggle */}
          <label className="flex items-center">
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

          {/* Sort Dropdown */}
          <div className="relative flex justify-end items-center">
            <button
              onClick={() => setSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center justify-between px-4 py-2 text-sm text-black w-52"
            >
              Trier par :{" "}
              {sortAttribute === "price"
                ? sortOrder === "asc"
                  ? "Prix croissant"
                  : "Prix décroissant"
                : sortAttribute === "createdAt"
                ? "Nouveau"
                : "Popularité"}
              {isSortDropdownOpen ? <FaChevronUp className="ml-1 w-[9px]" /> : <FaChevronDown className="ml-1 w-[9px]" />}
            </button>

            {isSortDropdownOpen && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-sm shadow-md z-10 w-52">
                <button
                  onClick={() => handleSortOptionClick("unitsSold", "desc")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Popularité
                </button>
                <button
                  onClick={() => handleSortOptionClick("price", "asc")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Prix croissant
                </button>
                <button
                  onClick={() => handleSortOptionClick("price", "desc")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Prix décroissant
                </button>
                <button
                  onClick={() => handleSortOptionClick("createdAt", "desc")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Nouveau
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid with Conditional Loading Spinner */}
        {loading ? (
          <p className="text-center text-lg">Loading products...</p>
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
                    <h3 className="mt-1 text-[13px] sm:text-[14px] font-medium">{product.productName}</h3>
                    <p className="text-[13px] sm:text-[14px] text-gray-600">{product?.onSale ? (product.price * (1 - product.salePercentage / 100)).toFixed(0): product?.price.toFixed(0)} DT</p>
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
