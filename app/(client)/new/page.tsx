"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';

type Product = {
  salePercentage: number;
  onSale: any;
  _id: string;
  productName: string;
  price: number;
  images: string[];
  mainImageNumber: number;
};

const NewPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`api/products?sort=createdDate&limit=16`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="px-6 mx-4 sm:mx-12 py-4 pt-2">
      <h2 className="text-2xl font-md mb-4">Nos derniers ajouts</h2>
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link key={product._id} href={`product/${product._id}`} className="cursor-pointer transform transition duration-300 hover:scale-105 border border-black rounded-sm pb-1">
                <div>
                  <Image
                    src={product.images[0]}
                    alt={product.productName}
                    width={460}
                    height={460}
                    className="w-full h-60 rounded-sm object-cover mx-auto"
                    loading="lazy"
                  />
                  <h3 className="mt-1 pl-2 text-[13px] sm:text-[14px] font-medium">{product.productName}</h3>
                  <p className="text-[13px] pl-2  sm:text-[14px] text-gray-600">{product?.onSale ? <div>{(product.price * (1 - product.salePercentage / 100)).toFixed(0) } DT<span className="line-through text-gray-500 ml-2">{product.price.toFixed(0)} DT</span></div> : <div>{product?.price.toFixed(0)} DT</div> } </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-center text-lg">Aucun produit n’a été trouvé 😔</p>
          </div>
        )
      )}
    </section>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<p className="text-center text-lg">Loading search results...</p>}>
      <NewPage />
    </Suspense>
  );
};

export default Page;
