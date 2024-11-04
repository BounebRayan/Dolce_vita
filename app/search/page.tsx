"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

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
      setLoading(true); 
      try {
        const response = await fetch(`/api/products/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
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
  }, [query]);

  return (
    <section className="px-6 mx-12 py-4 pt-2">
      <h2 className="text-2xl font-md mb-4">Résultats de recherche pour: "{searchTerm}"</h2>
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        products.length > 0 ? (
          <div className="grid grid-cols-5 gap-4">
            {products.map((product) => (
              <Link key={product._id} href={`product/${product._id}`} className="cursor-pointer transform transition duration-300 hover:scale-105">
                <div>
                  <img
                    src={product.images[product.mainImageNumber - 1] || '/fallback-image.jpg'}
                    alt={product.productName}
                    className="w-[360px] h-[360px] rounded-sm object-cover mx-auto"
                    loading='lazy'
                  />
                  <h3 className="mt-2 text-[13px] sm:text-[14px] font-bold">{product.productName}</h3>
                  <p className="text-[13px] sm:text-[14px] text-gray-600">{product.price} DT</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-center text-lg">Aucun produit n’a été trouvé, essayez d’utiliser un autre terme 😔</p>
          </div>
        )
      )}
    </section>
  );
  
};

const Page = () => {
  return (
    <Suspense>
      <SearchPage/>
    </Suspense>
  )
}

export default Page