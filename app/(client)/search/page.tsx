'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { FaChevronDown, FaChevronUp, FaArrowUp, FaArrowDown } from 'react-icons/fa';

type Product = {
  category: string;
  salePercentage: number;
  _id: string;
  productName: string;
  price: number;
  images: string[];
  mainImageNumber: number;
  onSale: boolean;
  unitsSold: number;
  createdAt: string;
  brand?: string;
  isPurchasable?: boolean;
};

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [searchTerm, setSearchTerm] = useState<string>(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter and Sort states
  const [priceRange, setPriceRange] = useState<number[]>([0, 20000]);
  const [filterCategory, setFilterCategory] = useState<string>('all'); // 'all', 'onSale', 'Meubles', 'Déco'
  const [sortAttribute, setSortAttribute] = useState<string>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isSortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const handleSortOptionClick = (attribute: string, order: 'asc' | 'desc') => {
    setSortAttribute(attribute);
    setSortOrder(order);
    setSortDropdownOpen(false);
  };

  const handleFilterOptionClick = (category: string) => {
    setFilterCategory(category);
    setFilterDropdownOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/products/search?query=${encodeURIComponent(query)}&priceMin=${priceRange[0]}&priceMax=${priceRange[1]}&sort=${sortAttribute}&order=${sortOrder}`
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
  }, [query, priceRange, sortAttribute, sortOrder]);

  // Group products by category and apply filters
  let meublesProducts = products.filter(p => p.category === 'Meubles');
  let decoProducts = products.filter(p => p.category === 'Déco');

  // Apply filter category
  if (filterCategory === 'onSale') {
    meublesProducts = meublesProducts.filter(p => p.onSale);
    decoProducts = decoProducts.filter(p => p.onSale);
  } else if (filterCategory === 'Meubles') {
    decoProducts = [];
  } else if (filterCategory === 'Déco') {
    meublesProducts = [];
  }

  const hasBothCategories = meublesProducts.length > 0 && decoProducts.length > 0;
  const totalFilteredProducts = meublesProducts.length + decoProducts.length;

  return (
    <section className="flex flex-col lg:flex-row mx-4 sm:mx-16 mt-3 mb-8">
      <main className="w-full pl-0 lg:pl-4">
        <h2 className="text-[28px] font-semibold">Résultats de recherche pour: <span className="font-light italic">"{searchTerm}"</span></h2>
        <p className="text-sm text-gray-600 mb-3">{totalFilteredProducts} produits trouvés</p>
        <div className="border-t pt-2"></div>
        <div className='flex items-center justify-end gap-3 mb-1'>
          {/* Filter Dropdown */}
          <div className="relative flex items-center">
            <button
              onClick={() => setFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center justify-between px-4 py-2 text-sm text-black w-44 sm:w-52"
            >
              <span className="hidden sm:inline">Filtrer :</span><span className="sm:hidden">Filtre</span>{" "}
              {filterCategory === "all"
                ? "Tous les produits"
                : filterCategory === "onSale"
                ? "En solde"
                : filterCategory === "Meubles"
                ? "Meubles"
                : "Décorations"}
              {isFilterDropdownOpen ? <FaChevronUp className="ml-1 w-[9px]" /> : <FaChevronDown className="ml-1 w-[9px]" />}
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-sm shadow-md z-10 w-52">
                <button
                  onClick={() => handleFilterOptionClick("all")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Tous les produits
                </button>
                <button
                  onClick={() => handleFilterOptionClick("onSale")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  En solde
                </button>
                <button
                  onClick={() => handleFilterOptionClick("Meubles")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Meubles
                </button>
                <button
                  onClick={() => handleFilterOptionClick("Déco")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Décorations
                </button>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
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
          <p className="text-center text-lg">Un instant, nous récupérons les produits...</p>
        ) : totalFilteredProducts > 0 ? (
          <>
            {/* Meubles Section */}
            {meublesProducts.length > 0 && (
              <div className={hasBothCategories ? "mb-12" : ""}>
                {hasBothCategories && (
                  <h3 className="text-xl font-semibold mb-4">Meubles ({meublesProducts.length})</h3>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {meublesProducts.map((product) => (
                    <Link key={product._id} href={`/product/${product._id}`} className="cursor-pointer transform transition hover:scale-[1.02] duration-300 rounded-sm pb-1">
                      <div>
                        <img
                          src={product.images[0]}
                          alt={product.productName}
                          className="w-full rounded-sm object-cover aspect-[6/4]"
                          loading="lazy"
                        />
                        <h3 className="mt-1 text-sm lg:text-[14px] font-medium">{product.productName}</h3>
                        {product.brand && (
                          <p className="text-xs lg:text-[12px] text-gray-500">{product.brand}</p>
                        )}
                        {product.isPurchasable && (
                          <p className="text-sm text-gray-600">
                            {product?.onSale ? (
                              <div>
                                {(product.price * (1 - product.salePercentage / 100)).toFixed(0)} DT
                                <span className="line-through text-gray-500 ml-2">{product.price.toFixed(0)} DT</span>
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
            )}

            {/* Déco Section */}
            {decoProducts.length > 0 && (
              <div>
                {hasBothCategories && (
                  <h3 className="text-xl font-semibold mb-4">Décorations ({decoProducts.length})</h3>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {decoProducts.map((product) => (
                    <Link key={product._id} href={`/product/${product._id}`} className="cursor-pointer transform transition hover:scale-[1.02] duration-300 rounded-sm pb-1">
                      <div>
                        <img
                          src={product.images[0]}
                          alt={product.productName}
                          className="w-full rounded-sm object-cover aspect-[4/5]"
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
                                <span className="line-through text-gray-500 ml-2">{product.price.toFixed(0)} DT</span>
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
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-64 w-full">
            <p className="text-center text-lg ml-2">Aucun produit n'a été trouvé, essayez d'utiliser un autre terme</p>
          </div>
        )}
      </main>
    </section>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<p className="text-center text-lg">Un instant, nous récupérons les résultats de recherche...</p>}>
      <SearchPage />
    </Suspense>
  );
};

export default Page;
