"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

type Product = {
    _id: string;
    productName: string;
    price: string;
    images: string[];
    mainImageNumber: number;
};

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setSearchTerm(query);

    const fetchData = async () => {
      setLoading(true);  // Reset loading when search term changes
      try {
        const response = await fetch(`products/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchData();
    }
  }, [query, searchParams]);

  return (
    <section className="px-6 mx-16 py-4">
      <h2 className="text-2xl font-semibold mb-4">Résultats de recherche pour: "{searchTerm}"</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {products.length > 0 ? (
            products.map((product) => (
              <Link key={product._id} href={`/product/${product._id}`}>
              <div className="text-center">
                <img
                  src={product.images[product.mainImageNumber-1]}
                  alt={product.productName}
                  className="w-[320px] h-[320px] rounded-sm object-cover mx-auto"
                />
                <h3 className="mt-2 text-lg">{product.productName}</h3>
                <p className="mt-1 text-gray-600">{product.price}</p>
              </div>
              </Link>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default SearchPage;