'use client'
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  productName: string;
  price: number;
  images: string[];
  // Add more fields as needed
}

interface SubcategoryPageProps {
  params: { subcategory: string };
}

const SubcategoryPage = ({ params }: SubcategoryPageProps) => {
  const { subcategory } = params;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductsBySubcategory = async () => {
      try {
        const response = await axios.get('products/subcategory', {
          params: { subcategory },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (subcategory) fetchProductsBySubcategory();
  }, [subcategory]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-semibold mb-6 capitalize">{subcategory} Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="text-center cursor-pointer transform transition duration-300 hover:scale-105">
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="w-full h-[320px] object-cover rounded-sm"
                />
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{product.productName}</h3>
                <p className="mt-1 text-gray-600">{product.price.toFixed(2)} DT</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No products found in this subcategory.</p>
        )}
      </div>
    </div>
  );
};

export default SubcategoryPage;